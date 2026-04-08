import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/progress');
        setData(response.data);
      } catch (err) {
        console.error("Failed to load progress data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <div className="flex-center min-h-screen"><h2>Loading Analytics...</h2></div>;
  }

  if (!data) {
    return <div className="flex-center min-h-screen"><h2>Failed to load analytics.</h2></div>;
  }

  const { history, metrics } = data;

  return (
    <div className="container min-h-screen" style={{ paddingTop: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary)' }}>Your Learning Journey</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Dashboard</button>
      </header>

      <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Core Metrics</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {metrics.total_attempted}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Total Questions Encountered</div>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {metrics.overall_accuracy}%
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Average Accuracy</div>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {metrics.mastered_questions}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Mastered (Never seeing again)</div>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>History</h3>
        {history && history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((session, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '1rem',
                backgroundColor: 'var(--bg-color)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontWeight: 600 }}>{session.date}</div>
                <div>
                  <span style={{ color: 'var(--secondary)', fontWeight: 600, marginRight: '1rem' }}>{session.correct} Correct</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{session.incorrect} Incorrect</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No test sessions completed yet. Start taking tests to view progress history!</p>
        )}
      </div>
    </div>
  );
};

export default Progress;
