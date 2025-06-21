const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Note = require('../models/Note');

// ➕ Créer une note
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { projetId, contenu } = req.body;

    if (!projetId || !contenu) {
      return res.status(400).json({ message: 'projetId et contenu sont requis' });
    }

    const note = new Note({
      projetId,
      contenu,
      auteur: req.user.name || req.user.email,
      automatique: false
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Route GET pour récupérer les notes d’un projet
router.get('/byProject/:projectId', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ projetId: req.params.projectId }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
