import React, { useState } from 'react';
import './UserMenu.css';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="user-menu-container">
      <div className="user-icon" onClick={() => setOpen(!open)}>
        <FaUserCircle size={28} />
      </div>
      {open && (
        <div className="user-dropdown">
          <div className="user-option" onClick={() => alert('Profil')}>Profil</div>
          <div className="user-option" onClick={handleLogout}>Se déconnecter</div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
