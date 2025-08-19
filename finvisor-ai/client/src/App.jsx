import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          {/* The broken tag is now fixed */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
