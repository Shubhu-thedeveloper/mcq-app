import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card animate-fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
