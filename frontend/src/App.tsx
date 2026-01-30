import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/home';
import Login from './components/Auth/LoginForm';
import Signup from './components/Auth/SignupForm';
import Dashboard from './pages/Dashboard';
import VolunteerSignup from './components/Auth/VolunteerSignupForm';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Heatmap from './pages/Heatmap';
import Profile from './pages/Profile';

// Styles
import './App.css';
import './styles/global.css';
import './styles/components.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/volunteer-signup" element={<VolunteerSignup />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/reports" element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            } />
            <Route path="/alerts" element={
              <PrivateRoute>
                <Alerts />
              </PrivateRoute>
            } />
            <Route path="/heatmap" element={
              <PrivateRoute>
                <Heatmap />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;