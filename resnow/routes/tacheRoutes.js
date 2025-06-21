const express = require('express');
const router = express.Router();
const tacheController = require('../controllers/tacheController');
const { authMiddleware } = require('../middleware/authMiddleware');
// Ouvrir une tâche
router.put('/:id/ouvrir', tacheController.ouvrirTache);

// Fermer une tâche
router.put('/fermer/:id', tacheController.fermerTache);

//route de get projet by id
router.get('/byProject/:projectId', authMiddleware, tacheController.getTachesByProject);

//ouvrir une tache
router.put('/ouvrir/:id', authMiddleware, tacheController.ouvrirTache);



module.exports = router;
