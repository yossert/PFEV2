const Tache = require('../models/Tache');
const Project = require('../models/Project');

// Configuration des champs requis par type de tâche
const champsRequisParTache = {
  "Paramétrage Client": [
    "Nom_MMO", "Region_MMO", "MMO_brassage", "Reference_MSISDN", "Region_client",
    "Type_securisation", "Type_commande", "Adresse_postale",
    "Nom_contact_client_1", "Prenom_contact_client_1", "Telephone_fixe_contact_client_1",
    "Email_contact_client_1", "Contact_client_1"
  ],
  "Brassage": [
    "Nom_Brasseur", "Date_braissage", "Cable_utilisé"
  ],
  "Configuration": [
    "Equipement_configuré", "IP_assignée", "Login_config"
  ],
  "RDV Client": [
    "Date_RDV", "Heure_RDV", "Client_confirmé"
  ]
};

// ✅ Ouvrir une tâche
exports.ouvrirTache = async (req, res) => {
  try {
    const { id } = req.params;
    const tache = await Tache.findById(id).populate('tachePrecedente');

    if (!tache) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    // Empêcher si déjà en cours ou terminée
    if (tache.etat === 'ouverte' || tache.etat === 'terminée') {
      return res.status(400).json({ message: 'Tâche déjà ouverte ou terminée' });
    }

    // Vérifier que la tâche précédente est terminée (si elle existe)
    if (tache.tachePrecedente && tache.tachePrecedente.etat !== 'terminée') {
      return res.status(400).json({ message: 'La tâche précédente doit être terminée.' });
    }

    // Passer la tâche à "ouverte"
    tache.etat = 'ouverte';
    tache.dateDebut = new Date();
    await tache.save();

    res.json({ message: 'Tâche ouverte avec succès', tache });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ✅ Fermer une tâche avec validation des champs requis
exports.fermerTache = async (req, res) => {
  try {
    const { id } = req.params;


    //
    //
    const { champs } = req.body;

    

    const tache = await Tache.findById(id);
    if (!tache) return res.status(404).json({ message: 'Tâche introuvable' });

    if (tache.etat !== 'ouverte') {
      return res.status(400).json({ message: 'La tâche n\'est pas ouverte' });
    }

    // Récupération du type/nom de la tâche (clé de vérification des champs)
    const nomTache = tache.nom || tache.type;
    const champsRequis = champsRequisParTache[nomTache];

    if (!champsRequis) {
      return res.status(400).json({ message: `Champs requis non définis pour la tâche : ${nomTache}` });
    }

    // Vérification que tous les champs requis sont présents et non vides
    for (const champ of champsRequis) {
      if (!champs[champ] || champs[champ].toString().trim() === "") {
        return res.status(400).json({ message: `Champ requis manquant : ${champ}` });
      }
    }

    // Mise à jour de la tâche
    tache.champs = champs;
    tache.etat = 'terminée';
    tache.dateFin = new Date();
    tache.champsComplet = true;
    tache.pourcentageTermine = 100;
    await tache.save();

    // 🔁 Mise à jour automatique du projet si c’est la tâche "Paramétrage Client"
    if (tache.nom === 'Paramétrage Client') {
      const {
        Nom_MMO: client,
        Reference_MSISDN: msisdn,
        Region_MMO: regionMMO
      } = champs;

      await Project.findByIdAndUpdate(tache.project, {
        client,
        msisdn,
        regionMMO
      });
    }

    // ✅ Vérifie si toutes les tâches du projet sont terminées
    await updateProjectStatusIfCompleted(tache.project);

    res.json({ message: 'Tâche fermée avec succès', tache });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ✅ Récupérer toutes les tâches d’un projet donné
exports.getTachesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const taches = await Tache.find({ project: projectId }).sort({ createdAt: 1 });
    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// ✅ Vérifie si toutes les tâches d’un projet sont terminées, et met à jour son statut
async function updateProjectStatusIfCompleted(projectId) {
  const taches = await Tache.find({ project: projectId });
  const allDone = taches.every(t => t.etat === 'terminée');

  if (allDone) {
    await Project.findByIdAndUpdate(projectId, { status: 'termine' });
  }
}




