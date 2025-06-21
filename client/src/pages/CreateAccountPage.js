import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'consultant',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/create', formData);
      navigate('/dashboard'); // ✅ retour au dashboard si succès
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la création.';
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Créer un compte</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="consultant">Consultant</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Créer le compte
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
