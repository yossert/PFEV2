const commandeSchema = new mongoose.Schema({
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  // Champs obligatoires de la 1ère tâche
  nomMMO: String,
  regionMMO: String,
  mmoBrassage: String,
  referenceMSISDN: String,
  regionClient: String,
  typeSecurisation: String,
  typeCommande: String,
  adressePostale: String,
  nomContact1: String,
  prenomContact1: String,
  telFixeContact1: String,
  telPortableContact1: String,
  emailContact1: String,
  contactClient1: String,
  nomContact2: String,
  prenomContact2: String,
  telFixeContact2: String,
  telPortableContact2: String,
  emailContact2: String,
  contactClient2: String,
  debit: String,
  referenceLienAdduction: String,
  nomCPE: String,
  moduleSFPCPE: String,
  typeInstallationCPE: String,
  porteeMaxModuleSFP: String,
  siteGeoClient: String,
  siteTClient: String,
  latitude: String,
  longitude: String,
}, { timestamps: true });

module.exports = mongoose.model('Commande', commandeSchema);


// Exemple d'ouverture de la tâche "Paramétrage Client"
async function ouvrirTache(tacheId) {
  const task = await Tache.findById(tacheId).populate('tachePrecedente');
  if (task.etat !== 'Pending') return { message: 'Tâche déjà ouverte ou fermée.' };

  if (task.tachePrecedente && task.tachePrecedente.etat !== 'Close Complete') {
    return { message: 'Impossible d\'ouvrir cette tâche tant que la précédente n\'est pas terminée.' };
  }

  task.etat = 'Open';
  task.dateDebut = new Date();
  await task.save();
  return { message: 'Tâche ouverte avec succès.' };
}


// Exemple de fermeture de la tâche après validation de formulaire
async function fermerTache(tacheId) {
  const task = await Tache.findById(tacheId);
  if (task.etat !== 'Open') return { message: 'Tâche non ouverte.' };
  if (!task.champsComplet) return { message: 'Tous les champs obligatoires doivent être complétés.' };

  task.etat = 'Close Complete';
  task.pourcentageTermine = 100;
  task.dateFin = new Date();
  await task.save();
  return { message: 'Tâche fermée avec succès.' };
}
