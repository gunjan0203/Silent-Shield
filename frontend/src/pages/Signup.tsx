import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import './Signup.css';

type Role = 'USER' | 'VOLUNTEER';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    try {
      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail.map((e: any) => e.msg).join(', '));
        } else {
          setError(String(data.detail || 'Signup failed'));
        }
        return;
      }

      setSuccess('Account created successfully!');
      setTimeout(() => window.location.href = '/login', 1500);
    } catch {
      setError('Backend not reachable');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="signup-title">
          <div className="form-group">
          <input
            placeholder="Full name"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          </div>

          <div className="form-group">
          <input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          </div>

          <div className="form-group">
          <input
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />
          </div>

          <div className="form-group">
          <select
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="VOLUNTEER">Volunteer</option>
          </select>
          </div>

          <button type="submit">Signup</button>
        </form>
        <div className="signup-links">
          <p>Already have an account? <Link to="/login" className="link">Login</Link></p>
          <Link to="/" className="link">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};


export default Signup;