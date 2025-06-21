const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, isSuperAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/create', authMiddleware, isSuperAdmin, authController.createUserBySuperAdmin);

//update-role de user par super admin

router.put(
    '/update-role/:id',
    authMiddleware,
    isSuperAdmin,
    authController.updateUserRole
  );


  //consulter la liste de user par super admin , et consultant et admin pour admin 
  router.get('/', authMiddleware, authController.getAllUsers);

  // DELETE user by ID
// Correct
router.delete('/delete/:id', authMiddleware, isSuperAdmin, async (req, res) => {

  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json({ message: `Utilisateur avec ID ${userId} supprimé.` });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
});



  
module.exports = router;
