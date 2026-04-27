import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../api';

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get('email') || '';
  const type = query.get('type') || 'registration'; // 'registration' or 'forgot'

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    try {
      await api.post('/auth/verify-otp', { email, otp });
      if (type === 'registration') {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        navigate(`/reset-password?email=${email}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { email, type });
      setTimer(30);
      setCanResend(false);
      setMessage('New OTP sent to your email');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (!email) {
    return <div className="flex-center min-h-screen">Invalid verification link</div>;
  }

  return (
    <div className="flex-center min-h-screen">
      <div className="glass-panel animate-fade-in" style={{ width: '400px', textAlign: 'center' }}>
        <div className="flex-center" style={{ marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
            <ShieldCheck size={40} />
          </div>
        </div>
        
        <h2>Verify Email</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          We've sent a 6-digit code to <br/> <strong>{email}</strong>
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{message}</div>}

        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            placeholder="Enter 6-digit code" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
            required 
          />
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Verify & Proceed
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          {canResend ? (
            <button className="btn-icon" onClick={handleResend} style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Resend OTP
            </button>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              Resend code in <strong style={{ color: 'var(--text-main)' }}>{timer}s</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
