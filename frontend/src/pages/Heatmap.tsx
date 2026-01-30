import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Heatmap.css';

interface HeatmapData {
  location: string;
  latitude: number;
  longitude: number;
  alert_count: number;
  report_count: number;
  risk_score: number;
}

const Heatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<HeatmapData | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const response = await api.get('/heatmap/');
      setHeatmapData(response.data || []);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      // Sample data for demonstration
      setHeatmapData([
        {
          location: "Central Park",
          latitude: 40.785091,
          longitude: -73.968285,
          alert_count: 12,
          report_count: 8,
          risk_score: 85
        },
        {
          location: "Downtown Area",
          latitude: 40.758896,
          longitude: -73.985130,
          alert_count: 8,
          report_count: 15,
          risk_score: 72
        },
        {
          location: "University Campus",
          latitude: 40.807536,
          longitude: -73.962573,
          alert_count: 5,
          report_count: 10,
          risk_score: 45
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const filteredData = heatmapData.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'HIGH') return item.risk_score >= 70;
    if (filter === 'MEDIUM') return item.risk_score >= 40 && item.risk_score < 70;
    if (filter === 'LOW') return item.risk_score < 40;
    return true;
  });

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h1>Safety Heatmap</h1>
        <p>View reported unsafe areas and emergency hotspots in your city</p>
      </div>

      <div className="heatmap-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Areas
          </button>
          <button 
            className={`filter-button ${filter === 'HIGH' ? 'active' : ''}`}
            onClick={() => setFilter('HIGH')}
          >
            🔴 High Risk
          </button>
          <button 
            className={`filter-button ${filter === 'MEDIUM' ? 'active' : ''}`}
            onClick={() => setFilter('MEDIUM')}
          >
            🟡 Medium Risk
          </button>
          <button 
            className={`filter-button ${filter === 'LOW' ? 'active' : ''}`}
            onClick={() => setFilter('LOW')}
          >
            🟢 Low Risk
          </button>
        </div>

        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color high-risk"></div>
            <span>High Risk (70-100)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium-risk"></div>
            <span>Medium Risk (40-69)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low-risk"></div>
            <span>Low Risk (0-39)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-heatmap">
          <p>Loading heatmap data...</p>
        </div>
      ) : (
        <>
          {/* Map Visualization (Placeholder) */}
          <div className="map-container">
            <div className="map-placeholder">
              <h3>🗺️ Interactive Heatmap</h3>
              <p>This area would display an interactive map with heatmap overlay</p>
              <p className="map-note">
                📍 Click on locations below to view details
              </p>
              
              {/* Simulated map points */}
              <div className="simulated-map">
                {filteredData.map((item, index) => (
                  <div 
                    key={index}
                    className={`map-point ${getRiskColor(item.risk_score)}`}
                    style={{
                      left: `${(index + 1) * 25}%`,
                      top: `${(index * 20 + 30)}%`,
                    }}
                    onClick={() => setSelectedLocation(item)}
                    title={`${item.location} - Risk: ${item.risk_score}`}
                  >
                    <div className="point-label">{item.location.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location List */}
          <div className="locations-list">
            <h3>Risk Areas</h3>
            <div className="locations-grid">
              {filteredData.map((item, index) => (
                <div 
                  key={index} 
                  className={`location-card ${getRiskColor(item.risk_score)}`}
                  onClick={() => setSelectedLocation(item)}
                >
                  <div className="location-header">
                    <h4>{item.location}</h4>
                    <div className="risk-badge">
                      {getRiskLevel(item.risk_score)}
                    </div>
                  </div>
                  
                  <div className="location-stats">
                    <div className="stat">
                      <div className="stat-value">{item.alert_count}</div>
                      <div className="stat-label">Alerts</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-value">{item.report_count}</div>
                      <div className="stat-label">Reports</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-value">{item.risk_score}</div>
                      <div className="stat-label">Risk Score</div>
                    </div>
                  </div>
                  
                  <div className="location-coordinates">
                    📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="location-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedLocation.location}</h3>
              <button 
                className="close-modal"
                onClick={() => setSelectedLocation(null)}
              >
                ✕
              </button>
            </div>
            
            <div className={`modal-risk-indicator ${getRiskColor(selectedLocation.risk_score)}`}>
              {getRiskLevel(selectedLocation.risk_score)} Area
            </div>
            
            <div className="modal-details">
              <div className="detail-item">
                <strong>📍 Coordinates:</strong>
                <p>{selectedLocation.latitude}, {selectedLocation.longitude}</p>
              </div>
              
              <div className="detail-item">
                <strong>🚨 Emergency Alerts:</strong>
                <p>{selectedLocation.alert_count} alerts reported</p>
              </div>
              
              <div className="detail-item">
                <strong>📝 Safety Reports:</strong>
                <p>{selectedLocation.report_count} reports filed</p>
              </div>
              
              <div className="detail-item">
                <strong>⚠️ Risk Score:</strong>
                <div className="risk-meter">
                  <div 
                    className="risk-meter-fill"
                    style={{ width: `${selectedLocation.risk_score}%` }}
                  ></div>
                  <div className="risk-meter-text">{selectedLocation.risk_score}/100</div>
                </div>
              </div>
              
              <div className="detail-item">
                <strong>💡 Safety Tips:</strong>
                <ul className="safety-tips">
                  <li>Avoid traveling alone in this area at night</li>
                  <li>Stay in well-lit areas</li>
                  <li>Keep emergency contacts ready</li>
                  <li>Report any suspicious activity</li>
                </ul>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-button report" onClick={() => window.location.href = '/reports'}>
                📝 Report This Area
              </button>
              <button className="modal-button directions">
                🗺️ Get Directions
              </button>
              <button className="modal-button close" onClick={() => setSelectedLocation(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Statistics */}
      <div className="heatmap-stats">
        <div className="stats-card">
          <h4>Heatmap Statistics</h4>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-box-value">{heatmapData.length}</div>
              <div className="stat-box-label">Monitored Areas</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-box-value">
                {heatmapData.filter(d => d.risk_score >= 70).length}
              </div>
              <div className="stat-box-label">High Risk Areas</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-box-value">
                {heatmapData.reduce((sum, d) => sum + d.alert_count, 0)}
              </div>
              <div className="stat-box-label">Total Alerts</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-box-value">
                {Math.round(heatmapData.reduce((sum, d) => sum + d.risk_score, 0) / heatmapData.length) || 0}
              </div>
              <div className="stat-box-label">Average Risk Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
