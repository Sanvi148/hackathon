import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

// Import the styles from your new CSS Module
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    // Use the class names from the imported 'styles' object
    <div className={styles.loginPageContainer}>
      <form onSubmit={onSubmit} className={styles.loginForm}>
        <h2 className={styles.title}>Welcome Back</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        
        <input name="username" onChange={onChange} placeholder="Username" required className={styles.inputField} />
        <input name="password" type="password" onChange={onChange} placeholder="Password" required className={styles.inputField} />
        
        <button type="submit" className={styles.submitButton}>Login</button>
        
        <p className={styles.switchText}>
          No account? <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
