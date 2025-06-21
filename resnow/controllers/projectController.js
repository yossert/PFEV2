// controllers/projectController.js

//importer le modèle Tache
const Tache = require('../models/Tache');
//importer le modèle user
const User = require('../models/User');
// SUPER ADMIN CREE UN PROJET 
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

// creer un projet 
exports.createProject = async (req, res) => {
  const { name, client } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Fichier de commande BTE requis' });
  }

  try {
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: 'Nom de projet déjà utilisé' });
    }

    const newProject = new Project({
      name,
      client,
      bteFilePath: file.path,
    });

    await newProject.save();
// Liste des noms de tâches par défaut
    const nomsTaches = [
  'Paramétrage Client',
  'Brassage',
  'Configuration',
  'RDV Client'
];

      // Mapping des champs requis pour chaque tâche
    const mappingChamps = {
      'Paramétrage Client': ['client', 'msisdn', 'typeReseau', 'region', 'siteClient'],
      'Brassage': ['brassageRealise', 'portSwitch', 'numRack'],
      'Configuration': ['equipement', 'adresseIP', 'login', 'motDePasse'],
      'RDV Client': ['dateRDV', 'heureRDV', 'contactClient']
    };

    let tachePrecedente = null;
    for (const nom of nomsTaches) {
      const nouvelleTache = new Tache({
        nom,
        project: newProject._id,
        tachePrecedente: tachePrecedente,
        champsComplet: false,
        pourcentageTermine: 0,
        champs: {},
        champsRequis: mappingChamps[nom] || [] // à adapter si tu as des champs obligatoires
      });
      await nouvelleTache.save();
      tachePrecedente = nouvelleTache._id;
    }

    res.status(201).json({ message: 'Projet créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


//GET_ALL_PROJECTS5SUPERADMIN PEUT VOIR TOUTS LES CMD BTE

exports.getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 }); // tri du plus récent au plus ancien
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({
        message: 'Erreur lors de la récupération des projets',
        error: error.message,
      });
    }
  };
  

  //supprimer un projet

  exports.deleteProject = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
  
      // Supprimer le fichier BTE associé s'il existe
      if (project.bteFile) {
        const filePath = path.join(__dirname, '..', 'uploads', project.bteFile);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // suppression du fichier physique
        }
      }
  
      await project.deleteOne();
  
      res.status(200).json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  };


  //chercher un projet 
  exports.searchProjects = async (req, res) => {
    try {
      const { name } = req.query;
      const filters = {};
  
      if (name) {
        filters.name = { $regex: name, $options: 'i' }; // recherche insensible à la casse
      }
  
      const projects = await Project.find(filters);
      res.status(200).json(projects);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };



  //Télécharger un fichier BTE

  exports.downloadBTEFile = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project || !project.bteFilePath) {
        return res.status(404).json({ message: 'Projet ou fichier introuvable' });
      }
  
      const filePath = project.bteFilePath;
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé sur le serveur' });
      }
  
      res.download(filePath, (err) => {
        if (err) {
          res.status(500).json({ message: 'Erreur lors du téléchargement du fichier', error: err.message });
        }
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  };

  // Affecter un projet à un consultant
exports.affecterProjet = async (req, res) => {
  const { projetId, consultantId } = req.body;

  try {
    // Vérification de l'existence du projet
    const projet = await Project.findById(projetId);
    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
        // Vérification de l'existence du consultant
    const consultant = await User.findById(consultantId);
    if (!consultant || consultant.role !== 'consultant') {
      return res.status(400).json({ message: 'Consultant invalide' });
    }
    // Affectation du consultant
    projet.consultant = consultantId;
    await projet.save();

    res.status(200).json({ message: 'Projet affecté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


  //mise à jour d’un projet par le super admin
  exports.updateProject = async (req, res) => {
    try {
      const { name, priority } = req.body;
      const project = await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
  
      if (name) project.name = name;
      if (priority !== undefined) project.priority = priority === 'true';
  
      // Mettre à jour le fichier s’il existe
      if (req.file) {
        // Supprimer l’ancien fichier si besoin
        if (project.bteFilePath && fs.existsSync(project.bteFilePath)) {
          fs.unlinkSync(project.bteFilePath);
        }
        project.bteFilePath = req.file.path;
      }
  
      await project.save();
      res.status(200).json({ message: 'Projet mis à jour', project });
  
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  };
  
// 🔍 Obtenir un projet par son ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId)
      .populate('consultant') // facultatif : si tu veux les infos du consultant lié
      .exec();

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};




// get commande by project
exports.getCommandeForm = async (req, res) => {
  try {
    const { id } = req.params;

    const taches = await Tache.find({ project: id, etat: 'terminée' });

    let formulaire = {};

    for (const tache of taches) {
      if (tache.champs && Object.keys(tache.champs).length > 0) {
        formulaire = { ...formulaire, ...tache.champs }; // Fusion intelligente
      }
    }

    res.status(200).json({ formulaire });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du formulaire de commande." });
  }
};


// post données dans la commande by project
exports.updateCommandeFields = async (req, res) => {
  const { projectId } = req.params;
  const { tacheId, champs } = req.body;

  try {
    // 1. Trouver la tâche concernée
    const tache = await Tache.findById(tacheId);
    if (!tache || String(tache.project) !== projectId) {
      return res.status(404).json({ message: "Tâche introuvable ou n'appartient pas au projet" });
    }

    // 2. Vérifier que la tâche est ouverte
    if (tache.etat !== 'ouverte') {
      return res.status(403).json({ message: "Impossible de modifier : tâche non ouverte" });
    }

    // 3. Récupérer les champs autorisés de la tâche
    const champsAutorises = tache.champsRequis || [];

    // 4. Récupérer le projet
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    // 5. Initialiser la commande si elle n'existe pas
    if (!project.commande) project.commande = {};

    // 6. Mettre à jour les champs autorisés
    const champsMisAJour = {};
    for (const champ of champsAutorises) {
      if (champs.hasOwnProperty(champ)) {
        project.commande[champ] = champs[champ];
        champsMisAJour[champ] = champs[champ];
      }
    }

    // 7. Enregistrer le projet
    await project.save();

    // 8. Marquer la tâche comme complète si tous les champs requis sont remplis
    const tousChampsRemplis = champsAutorises.every(champ => project.commande[champ]);
    if (tousChampsRemplis) {
      tache.champsComplet = true;
      await tache.save();
    }

    res.status(200).json({
      message: "Commande mise à jour avec succès",
      commande: project.commande,
      champsMisAJour,
    });

  } catch (error) {
    console.error("Erreur updateCommandeFields:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
