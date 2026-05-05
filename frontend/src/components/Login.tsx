import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address";
    
    if (!password) errors.password = "Password is required";

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const validationErrors = validateForm();
    if (validationErrors) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.accessToken);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.errors?.length > 0) {
        setError(err.response.data.errors[0].message);
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="flex-center min-h-screen">
      <div className="glass-panel animate-fade-in" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        <form onSubmit={handleLogin} noValidate>
          <div style={{ marginBottom: fieldErrors.email ? '0.5rem' : '0' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }} 
              style={{ marginBottom: fieldErrors.email ? '0.25rem' : '1rem' }}
            />
            {fieldErrors.email && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginLeft: '2px' }}>{fieldErrors.email}</div>}
          </div>
          
          <div style={{ marginBottom: fieldErrors.password ? '1rem' : '0' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }} 
              style={{ marginBottom: fieldErrors.password ? '0.25rem' : '1rem' }}
            />
            {fieldErrors.password && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginLeft: '2px' }}>{fieldErrors.password}</div>}
          </div>
          
          <button type="submit" className="btn btn-primary">
            <LogIn size={20} /> Login
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Forgot Password?</Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
