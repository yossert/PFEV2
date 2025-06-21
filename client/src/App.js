import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConsultantDashboard from './pages/ConsultantDashboard';
import Unauthorized from './pages/Unauthorized';
import PrivateRoute from './components/PrivateRoute';
import AllProjectsPage from './pages/AllProjectsPage';
import DetailProjet from './pages/DetailProjet';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/superadmin"
          element={
            <PrivateRoute roles={['superadmin']}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        

        <Route
          path="/dashboard/consultant"
          element={
            <PrivateRoute roles={['consultant']}>
              <ConsultantDashboard />
            </PrivateRoute>
          }
        />



        <Route
  path="/projects"
  element={
    <PrivateRoute roles={['superadmin']}>
      <AllProjectsPage />
    </PrivateRoute>
  }
/>


        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/projets/:id" element={<DetailProjet />} />

      </Routes>
    </Router>
  );
};

export default App;
