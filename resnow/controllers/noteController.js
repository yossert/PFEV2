// controllers/noteController.js
const Note = require('../models/Note');

// Récupérer les notes d’un projet
exports.getNotesByProject = async (req, res) => {
  try {
    const notes = await Note.find({ projetId: req.params.projectId }).sort({ date: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors du chargement des notes." });
  }
};

// Ajouter une nouvelle note
exports.createNote = async (req, res) => {
  const { projetId, contenu, auteur, automatique } = req.body;

  try {
    const nouvelleNote = await Note.create({
      projetId,
      contenu,
      auteur,
      automatique: automatique || false,
    });

    res.status(201).json(nouvelleNote);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la note." });
  }
};
