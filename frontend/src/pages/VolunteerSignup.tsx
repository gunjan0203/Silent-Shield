import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import './VolunteerSignup.css';

const VolunteerSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    city: ''
  });
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idPhoto) {
      setError('Please upload your ID photo');
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const volunteerData = {
        ...formData,
        id_photo: idPhoto
      };
      
      await authService.volunteerSignup(volunteerData);
      setSuccess('Volunteer application submitted successfully! We will verify your details and contact you.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-signup-container">
      <div className="volunteer-signup-card">
        <h2 className="volunteer-signup-title">Become a Volunteer</h2>
        <p className="volunteer-subtitle">Help keep your community safe</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="volunteer-signup-form">
          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="id_photo">ID Proof Photo *</label>
            <input
              type="file"
              id="id_photo"
              name="id_photo"
              onChange={handleFileChange}
              required
              accept="image/*"
              className="file-input"
            />
            <small>Upload a clear photo of your government ID (Aadhar, Driving License, etc.)</small>
          </div>
          
          <button type="submit" disabled={loading} className="volunteer-signup-button">
            {loading ? 'Submitting...' : 'Apply as Volunteer'}
          </button>
        </form>
        
        <div className="volunteer-signup-links">
          <p>Already have an account? <Link to="/login" className="link">Login</Link></p>
          <p>Regular user? <Link to="/signup" className="link">Sign up here</Link></p>
          <Link to="/" className="link">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSignup;