import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/TestPage';
import Progress from './pages/Progress';
import ResultPage from './pages/ResultPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
