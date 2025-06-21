const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  contenu: { type: String, required: true },
  auteur: { type: String, required: true }, // nom/email de l'auteur
  date: { type: Date, default: Date.now },
  automatique: { type: Boolean, default: false }
});

module.exports = mongoose.model('Note', noteSchema);
