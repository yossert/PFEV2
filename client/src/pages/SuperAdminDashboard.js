import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">Super Admin</div>
        <ul className="nav-links">
          <li><Link to="/projects">Tous Les Projets</Link></li>
          <li><Link to="/create-account">Créer un compte</Link></li>
          <li><Link to="/create-project">Créer un projet</Link></li>
          <li><Link to="/reporting">Reporting</Link></li>
        </ul>
        <UserMenu />
      </nav>

      <main className="dashboard-content">
        <h2>Bienvenue Super Admin</h2>
        {/* Contenu du tableau de bord ici */}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
