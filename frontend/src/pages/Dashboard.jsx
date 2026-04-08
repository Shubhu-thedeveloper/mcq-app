import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/progress');
        setMetrics(response.data.metrics);
      } catch (err) {
        console.error("Error fetching metrics", err);
      }
    };
    fetchMetrics();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container min-h-screen" style={{ paddingTop: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary)', fontWeight: 700 }}>MCQ Mastery</h1>
        <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--border)' }}>
          Logout
        </button>
      </header>

      <div className="card animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready for today's challenge?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Complete your daily test to master new topics and review weak areas.
        </p>
        <button onClick={() => navigate('/test')} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
          Start Daily Test
        </button>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Your Progress Overview</h3>
      {metrics ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{metrics.overall_accuracy}%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Overall Accuracy</div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{metrics.mastered_questions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mastered Questions</div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{metrics.weak_questions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Weak Areas</div>
          </div>

        </div>
      ) : (
        <p>Loading metrics...</p>
      )}

      <div style={{ textAlign: 'center' }}>
        <Link to="/progress" style={{ color: 'var(--primary)', fontWeight: 600 }}>View Full Analytics &rarr;</Link>
      </div>

    </div>
  );
};

export default Dashboard;
