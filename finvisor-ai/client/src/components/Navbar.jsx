import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-cyan-400">
          FinVisor AI
        </Link>
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-cyan-300">Login</Link>
              <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
