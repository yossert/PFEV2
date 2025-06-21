// src/pages/DetailProjet.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import './DetailProjet.css';
import NoteSection from '../components/NoteSection'; // ✅ import du composant

const DetailProjet = () => {
  const { id } = useParams();
  const [projet, setProjet] = useState(null);
  const [taches, setTaches] = useState([]);
  const [ongletActif, setOngletActif] = useState('taches');
  const [tacheIdToNom, setTacheIdToNom] = useState({});

  // ✅ récupérer le nom de l'utilisateur connecté
  const currentUser = JSON.parse(localStorage.getItem('user'))?.user?.name || 'Utilisateur';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Aucun token trouvé !");
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const res = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
        setProjet(res.data);

        const resTaches = await axios.get(`http://localhost:5000/api/taches/byProject/${id}`, config);
        setTaches(resTaches.data);

        const mapping = {};
        resTaches.data.forEach(t => {
          mapping[t._id] = t.nom;
        });
        setTacheIdToNom(mapping);

      } catch (err) {
        console.error("Erreur lors du chargement du projet ou des tâches :", err);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : '-';

  if (!projet) return <div>Chargement...</div>;

  return (
    <div className="detail-projet-container">
      <div className="header-projet">
        <h2>Détails du Projet</h2>
        <p><strong>Nom :</strong> {projet.name}</p>
        <p><strong>Numéro :</strong> {projet.numero || projet._id}</p>
        <p><strong>État :</strong> {projet.status}</p>
        <p><strong>Affecté à :</strong> {projet.consultant || 'Non affecté'}</p>
        <p><strong>Créé :</strong> {formatDate(projet.createdAt)}</p>
        <p><strong>Client :</strong> {projet.client || 'N/A'}</p>
        <button className="note-button">Note</button>

        {/* ✅ Intégration de la section Notes */}
        <NoteSection projetId={id} currentUser={currentUser} />
      </div>

      <div className="tabs-container">
        <button className={ongletActif === 'taches' ? 'active' : ''} onClick={() => setOngletActif('taches')}>
          Tâches de projets ({taches.length})
        </button>
        <button className={ongletActif === 'commandes' ? 'active' : ''} onClick={() => setOngletActif('commandes')}>
          Commandes
        </button>
        <button className={ongletActif === 'issues' ? 'active' : ''} onClick={() => setOngletActif('issues')}>
          Issues
        </button>
      </div>

      <div className="tab-content">
        {ongletActif === 'taches' && (
          <table className="taches-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Brève description</th>
                <th>Statut</th>
                <th>%</th>
                <th>Dépendance</th>
                <th>Date de début prévue</th>
                <th>Date de fin prévue</th>
                <th>Affecté à</th>
              </tr>
            </thead>
            <tbody>
              {taches.map((tache) => (
                <tr key={tache._id}>
                  <td>{tache._id}</td>
                  <td>{tache.nom}</td>
                  <td>{tache.etat}</td>
                  <td>{["terminée", "Terminé", "Close Complete"].includes(tache.etat) ? "100%" : "0%"}</td>
                  <td>{tacheIdToNom[tache.tachePrecedente] || '-'}</td>
                  <td>{formatDate(tache.dateDebut)}</td>
                  <td>{formatDate(tache.dateFin)}</td>
                  <td>{tache.consultant || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {ongletActif === 'commandes' && (
          <div>
            <p>Formulaire de commande à développer ici...</p>
          </div>
        )}

        {ongletActif === 'issues' && (
          <div>
            <p>Section des issues à développer...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailProjet;
