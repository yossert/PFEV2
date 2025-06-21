const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bteFilePath: { type: String, required: true },
  priority: { type: Boolean, default: false }, // Nouveau champ
  createdAt: { type: Date, default: Date.now },
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: ['enStock', 'enCours', 'termine'],
    default: 'enStock'
  } ,


   // 🚀 CHAMPS À AJOUTER
  client: { type: String, default: '' },
  msisdn: { type: String, default: '' },
  regionMMO: { type: String, default: '' },
  siteAncrage: { type: String, default: '' },
  typeReseau: { type: String, default: '' },
  dateFinPrevue: { type: Date, default: null }, // dernière tâche fermée
  pourcentage: { type: Number, default: 0 }, // progression %
});

module.exports = mongoose.model('Project', projectSchema);
