// models/Tache.js
const mongoose = require('mongoose');

const tacheSchema = new mongoose.Schema({
  nom: { type: String, required: true },
etat: {
  type: String,
  enum: ['fermée', 'ouverte', 'terminée'],
  default: 'fermée'
},

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  tachePrecedente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tache',
    default: null
  },
  champsComplet: { type: Boolean, default: false },
  pourcentageTermine: { type: Number, default: 0 },
  dateDebut: { type: Date, default: null },
  dateFin: { type: Date, default: null },

  champs: { type: Object, default: {} }, // Données remplies
  champsRequis: { type: [String], default: [] } // Champs obligatoires
}, { timestamps: true });

module.exports = mongoose.model('Tache', tacheSchema);
