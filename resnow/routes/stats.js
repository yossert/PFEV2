const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Tache = require('../models/Tache');
const { authMiddleware, isSuperAdmin } = require('../middleware/authMiddleware');

function calculerEtat(pourcentage, totalTaches) {
  if (totalTaches === 0) return 'en stock';
  if (pourcentage === 100) return 'terminé';
  return 'en cours';
}

// 📌 1. Route ADMIN – Statistiques globales
router.get('/admin/statistiques-globales-projets', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

    const projets = await Project.find();
    let enStock = 0, enCours = 0, termines = 0, terminesCeMois = 0;

    for (const projet of projets) {
      const taches = await Tache.find({ project: projet._id });
      const total = taches.length;
      const fermees = taches.filter(t => t.etat === 'fermée').length;
      const pourcentage = total > 0 ? (fermees / total) * 100 : 0;
      const etat = calculerEtat(pourcentage, total);

      if (etat === 'en stock') enStock++;
      if (etat === 'en cours') enCours++;
      if (etat === 'terminé') {
        termines++;
        if (new Date(projet.createdAt) >= debutMois) {
          terminesCeMois++;
        }
      }
    }

    res.json({
      enStock,
      enCours,
      termines,
      terminesCeMois
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur statistiques admin', error: err.message });
  }
});

// 📌 2. Route SUPER ADMIN – Détail des projets
router.get('/superadmin/liste-projets-detaillee', authMiddleware, isSuperAdmin, async (req, res) => {
  try {
    const projets = await Project.find();

    const liste = await Promise.all(
      projets.map(async (projet) => {
        const taches = await Tache.find({ project: projet._id });
        const total = taches.length;
        const fermees = taches.filter(t => t.etat === 'fermée').length;
        const pourcentage = total > 0 ? Math.round((fermees / total) * 100) : 0;
        const etat = calculerEtat(pourcentage, total);

        return {
          nom: projet.name,
          etat,
          pourcentage
        };
      })
    );

    res.json({ projets: liste });
  } catch (err) {
    res.status(500).json({ message: 'Erreur liste projets super admin', error: err.message });
  }
});

module.exports = router;

