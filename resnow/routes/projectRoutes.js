//ROUTE DE CRER UN PROJET PAR SUPER ADMIN
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');
const { updateCommandeFields } = require('../controllers/projectController');

// ✅ Route pour créer un projet (superadmin uniquement)
router.post(
  '/create',
  authMiddleware,
  isSuperAdmin,
  upload.single('bteFile'), // 'bteFile' doit correspondre au nom du champ fichier côté front
  projectController.createProject
);


// ✅ Route pour obtenir tous les projets
router.get('/', projectController.getAllProjects);

// Filtrage des projets
router.get('/search', authMiddleware, projectController.searchProjects);




// Supprimer un projet par ID (Super Admin uniquement)
router.delete('/:id', authMiddleware, isSuperAdmin, projectController.deleteProject);

//Télécharger un fichier BTE
router.get('/download/:id', authMiddleware, projectController.downloadBTEFile);

//mise à jour d’un projet par le super admin
router.put(
  '/:id',
  authMiddleware,
  isSuperAdmin,
  upload.single('bteFile'),
  projectController.updateProject
);


// routes/projectRoutes.js
router.get('/:id/commande', authMiddleware, projectController.getCommandeForm);


// route pour mettre à jour uniquement les champs de la tâche ouverte
router.put('/:projectId/commande/update', updateCommandeFields);


//getProjectById
router.get('/:id', projectController.getProjectById);


// Route pour affecter un projet à un consultant
router.post('/affecter', authMiddleware, isAdmin, projectController.affecterProjet);

// route pour mettre à jour uniquement les champs de la tâche ouverte
router.put('/:projectId/commande', authMiddleware, projectController.updateCommandeFields);





module.exports = router;
