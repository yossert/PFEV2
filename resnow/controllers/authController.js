const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Générateur sécurisé de mot de passe
const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join('');
};

// Génère un token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      mustChangePassword: user.mustChangePassword // 👈 changer le password awel cnx
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


// ============================
// 🟢 Enregistrement classique
// ============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const user = await User.create({
      name,
      email,
      password,
      role,
      mustChangePassword: false
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Utilisateur enregistré avec succès',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 🔐 Connexion utilisateur
// ============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===================================================================
// 👑 Création d’un utilisateur par le super admin + envoi de mot de passe
// ===================================================================
exports.createUserBySuperAdmin = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const password = generatePassword();

    const newUser = new User({
      name,
      email,
      password,
      role,
      mustChangePassword: true // ➕ Doit changer son mot de passe à la 1ère connexion
    });

    await newUser.save();

    // Config du transporteur mail (avec Gmail ici)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Création de votre compte ResNow',
      text: `Bonjour ${name},

Votre compte a été créé avec succès. Voici vos identifiants de connexion :

📧 Email : ${email}
🔐 Mot de passe temporaire : ${password}

Veuillez vous connecter et modifier votre mot de passe dès que possible.

Cordialement,
L’équipe ResNow`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Utilisateur créé et e-mail envoyé avec succès',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
////update-role de user par super admin

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['superadmin', 'admin', 'consultant'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Rôle mis à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
//super admin peut consulter tout les users et admin peut consuler les admins et consultants

exports.getAllUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === 'superadmin') {
      users = await User.find().select('-password');
    } else if (req.user.role === 'admin') {
      users = await User.find({ role: { $in: ['admin', 'consultant'] } }).select('-password');
    } else {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ✅ Changement de mot de passe (exigé lors du premier login ou manuel)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    user.password = newPassword;
    user.mustChangePassword = false; // ✅ Réinitialisé après changement
    await user.save();

    res.status(200).json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

