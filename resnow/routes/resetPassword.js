const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adapte ce chemin selon ta structure

const router = express.Router();

// ⚠️ Route de test temporaire — À SUPPRIMER après les tests
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email et nouveau mot de passe requis." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = newPassword; 
    await user.save();

    res.json({ message: `Mot de passe de ${user.role} mis à jour avec succès.` });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation", error: err.message });
  }
});

module.exports = router;
