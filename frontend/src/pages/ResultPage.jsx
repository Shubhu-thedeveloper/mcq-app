import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return (
      <div className="flex-center min-h-screen">
        <div className="card">
          <h2>No Results Found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const { correct_count = 0, incorrect_count = 0, details = [] } = result;
  const total = details.length > 0 ? details.length : correct_count + incorrect_count;
  const percentage = total > 0 ? Math.round((correct_count / total) * 100) : 0;

  return (
    <div className="container min-h-screen flex-center" style={{ flexDirection: 'column', padding: '2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Session Complete!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here's how you did on today's daily MCQs</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)' }}>{correct_count}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Correct</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--danger)' }}>{incorrect_count}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Incorrect</div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--bg-color)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>Accuracy: {percentage}%</div>
          {percentage >= 80 ? (
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Outstanding work! Keep up the momentum.</p>
          ) : percentage >= 50 ? (
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Good effort! Spaced repetition will help you master the weak areas.</p>
          ) : (
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Don't worry, weak questions will reappear in a few days so you can master them.</p>
          )}
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ width: '100%' }}>
          Return to Dashboard
        </button>
      </div>
      
      {details.length > 0 && (
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>Detailed Review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {details.map((item, index) => (
              <div 
                key={item.question_id} 
                className="card animate-fade-in" 
                style={{ 
                  borderLeft: `4px solid ${item.is_correct ? 'var(--secondary)' : 'var(--danger)'}`,
                  padding: '1.5rem'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.1rem', lineHeight: 1.5 }}>
                  {index + 1}. {item.question_text}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {item.options.map(opt => {
                    const isSelected = item.selected_key === opt.key;
                    const isCorrect = item.correct_key === opt.key;
                    
                    let bg = 'var(--surface)';
                    let border = 'var(--border)';
                    let icon = null;
                    
                    if (isCorrect) {
                      bg = 'rgba(16, 185, 129, 0.1)';
                      border = 'var(--secondary)';
                      icon = '✔️';
                    } else if (isSelected && !item.is_correct) {
                      bg = 'rgba(239, 68, 68, 0.1)';
                      border = 'var(--danger)';
                      icon = '❌';
                    }
                    
                    return (
                      <div 
                        key={opt.key}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${border}`,
                          backgroundColor: bg,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                           <span style={{fontWeight: 600, marginRight: '0.5rem'}}>{opt.key})</span>
                           {opt.text}
                        </div>
                        {icon && <span>{icon}</span>}
                      </div>
                    )
                  })}
                </div>
                {!item.selected_key && (
                  <div style={{ marginTop: '1rem', color: 'var(--danger)', fontWeight: 500, fontSize: '0.9rem' }}>
                    You skipped this question.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
