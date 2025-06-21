// AllProjectsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllProjectsPage.css';
import { Link } from 'react-router-dom';

const AllProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/projets/${projectId}`);
  };

  return (
    <div className="projects-container">
      <h2 className="page-title">Tous les Projets</h2>
      <table className="projects-table">
        <thead>
          <tr>
            <th>Nom du projet</th>
            <th>État</th>
            <th>Date de début réelle</th>
            <th>Date de fin prévue</th>
            <th>Client</th>
            <th>MSISDN</th>
            <th>Région MMO</th>
            <th>Site d’ancrage client</th>
            <th>Type réseau</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>
                <Link to={`/projets/${project._id}`} className="project-link">
        {project.name}
      </Link>
              </td>
              <td>
                {project.status === 'termine' ? 'Terminé' : 'En cours'}
              </td>
              <td>{new Date(project.createdAt).toLocaleDateString()}</td>
              <td>{project.dateFinPrevue ? new Date(project.dateFinPrevue).toLocaleDateString() : '-'}</td>
              <td>{project.client || '-'}</td>
              <td>{project.msisdn || '-'}</td>
              <td>{project.regionMMO || '-'}</td>
              <td>{project.siteAncrage || '-'}</td>
              <td>{project.typeReseau || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProjectsPage;
