import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Reports.css';

interface ReportFormData {
  description: string;
  latitude: number;
  longitude: number;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ReportFormData>({
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Fetch recent reports
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Note: You need to create an endpoint for fetching reports
      // const response = await api.get('/reports');
      // setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.description.trim()) {
      setError('Please enter a description');
      setLoading(false);
      return;
    }

    if (formData.latitude === 0 || formData.longitude === 0) {
      setError('Please enable location services');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/reports/', {
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      setSuccess('Report submitted successfully! Risk level: ' + response.data.risk_level);
      setFormData({
        ...formData,
        description: '',
      });
      
      // Refresh reports list
      fetchReports();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH':
        return 'high-risk';
      case 'MEDIUM':
        return 'medium-risk';
      case 'LOW':
        return 'low-risk';
      default:
        return '';
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Safety Reports</h1>
        <p>Report unsafe areas or incidents to help keep your community safe</p>
      </div>

      <div className="reports-content">
        {/* Report Form */}
        <div className="report-form-card">
          <h2>Submit a Report</h2>
          <p className="form-subtitle">
            Your report will help create a safety heatmap for your area.
            {user?.role === 'VOLUNTEER' && ' As a volunteer, your reports are prioritized.'}
          </p>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label htmlFor="description">What did you observe? *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the incident or unsafe condition (e.g., 'Poor lighting near the park', 'Suspicious activity at night')"
                rows={4}
                maxLength={255}
              />
              <small className="char-count">{formData.description.length}/255 characters</small>
            </div>

            <div className="location-info">
              <h4>📍 Location Details</h4>
              <div className="coordinates">
                <div className="coord">
                  <strong>Latitude:</strong> {formData.latitude.toFixed(6)}
                </div>
                <div className="coord">
                  <strong>Longitude:</strong> {formData.longitude.toFixed(6)}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setFormData({
                      ...formData,
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                    });
                  }
                )}
                className="refresh-location"
              >
                🔄 Refresh Location
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" disabled={loading} className="submit-report-button">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>

        {/* Recent Reports */}
        <div className="recent-reports-card">
          <h2>Recent Community Reports</h2>
          
          {reports.length > 0 ? (
            <div className="reports-list">
              {reports.map((report) => (
                <div key={report.id} className="report-item">
                  <div className="report-header">
                    <span className={`risk-badge ${getRiskColor(report.risk_level)}`}>
                      {report.risk_level}
                    </span>
                    <span className="report-time">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="report-description">{report.description}</p>
                  <div className="report-footer">
                    <span className="report-location">
                      📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </span>
                    {report.user_id && (
                      <span className="reported-by">Reported by user</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reports">
              <p>No reports yet. Be the first to report!</p>
              <p className="tip">💡 Tip: Report any suspicious activity or unsafe areas you notice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;