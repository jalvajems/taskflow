import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../api';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { name?: string; email?: string; password?: string } = {};
    
    if (!name.trim()) errors.name = "Name is required";
    else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address";
    
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const validationErrors = validateForm();
    if (validationErrors) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate(`/verify-otp?email=${email}&type=registration`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.errors?.length > 0) {
          setError(err.response.data.errors[0].message);
        } else {
          setError(err.response?.data?.message || 'Registration failed');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center min-h-screen">
      <div className="glass-panel animate-fade-in" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        <form onSubmit={handleRegister} noValidate>
          <div style={{ marginBottom: fieldErrors.name ? '0.5rem' : '0' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })); }} 
              style={{ marginBottom: fieldErrors.name ? '0.25rem' : '1rem' }}
            />
            {fieldErrors.name && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginLeft: '2px' }}>{fieldErrors.name}</div>}
          </div>

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

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span className="flex-center" style={{ gap: '0.5rem' }}>
                <span className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                Registering...
              </span>
            ) : (
              <>
                <UserPlus size={20} /> Register
              </>
            )}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
