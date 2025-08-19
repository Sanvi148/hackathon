import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', formData);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}
        <input name="username" onChange={onChange} placeholder="Username" required className="w-full bg-gray-700 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input name="password" type="password" onChange={onChange} placeholder="Password" required className="w-full bg-gray-700 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded text-white font-bold transition-colors">Register</button>
        <p className="text-center text-gray-400 mt-4">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
