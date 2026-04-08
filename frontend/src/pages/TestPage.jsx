import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/test/start');
        setQuestions(response.data);
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = (key) => {
    const currentQuestion = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: key
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map(q => ({
          question_id: q._id,
          selected_key: answers[q._id] || ""
        }))
      };
      
      const response = await api.post('/test/submit', payload);
      // Pass results to next page via state
      navigate('/results', { state: response.data });
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex-center min-h-screen"><h2>Loading your test...</h2></div>;
  }

  if (questions.length === 0) {
    return (
      <div className="flex-center min-h-screen container" style={{ flexDirection: 'column' }}>
        <h2>No questions available!</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedKey = answers[currentQ?._id];

  return (
    <div className="container min-h-screen" style={{ paddingTop: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Daily Test</h2>
        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
          {currentIndex + 1} / {questions.length}
        </div>
      </header>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {questions.map((q, idx) => (
          <div 
            key={q._id} 
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              cursor: 'pointer',
              border: currentIndex === idx ? '2px solid var(--primary-hover)' : '1px solid var(--border)',
              backgroundColor: answers[q._id] ? 'var(--primary)' : 'var(--surface)',
              color: answers[q._id] ? 'white' : 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      <div className="card animate-fade-in" key={currentQ._id} style={{ minHeight: '350px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          {currentQ.question_text}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQ.options.map(opt => (
            <div 
              key={opt.key}
              onClick={() => handleOptionSelect(opt.key)}
              style={{
                padding: '1rem 1.5rem',
                border: `2px solid ${selectedKey === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                backgroundColor: selectedKey === opt.key ? 'rgba(79, 70, 229, 0.05)' : 'var(--surface)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                backgroundColor: selectedKey === opt.key ? 'var(--primary)' : 'var(--bg-color)',
                color: selectedKey === opt.key ? 'white' : 'var(--text-main)',
                fontWeight: 600
              }}>
                {opt.key}
              </span>
              <span style={{ fontSize: '1rem' }}>{opt.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button 
          className="btn" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible', backgroundColor: 'var(--border)' }}
        >
          Previous
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={submitting} 
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            Next Question
          </button>
        )}
      </div>
      
      {currentIndex === questions.length - 1 && Object.keys(answers).length < questions.length && (
        <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '1rem' }}>
          You have {questions.length - Object.keys(answers).length} unanswered questions.
        </div>
      )}
    </div>
  );
};

export default TestPage;
