import React, { useState } from 'react';
import axios from '../axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/slices/authSlice';
import './Login.css'; // Import du style

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      dispatch(loginSuccess(res.data));
      
    // ✅ Stocker le token pour les requêtes suivantes
    localStorage.setItem("token", res.data.token);
      const role = res.data.user.role;
      if (role === 'superadmin') navigate('/dashboard/superadmin');
      else if (role === 'admin') navigate('/dashboard/admin');
      else navigate('/dashboard/consultant');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
