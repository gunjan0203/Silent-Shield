import React, { useState, useEffect } from 'react';
import './Map.css';

interface Alert {
  id: number;
  lat: number;
  lng: number;
  type: 'SOS' | 'MEDICAL' | 'FIRE' | 'POLICE' | 'OTHER';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  description?: string;
}

interface AlertMapProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  realTime?: boolean;
}

const AlertMap: React.FC<AlertMapProps> = ({
  alerts,
  onAlertClick,
  realTime = false,
}) => {
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SOS' | 'HIGH'>('ALL');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'SOS': return '🚨';
      case 'MEDICAL': return '🏥';
      case 'FIRE': return '🔥';
      case 'POLICE': return '🚔';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return '#ff0000';
      case 'MEDIUM': return '#ff9900';
      case 'LOW': return '#00aa00';
      default: return '#666666';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'ALL') return true;
    if (filter === 'SOS') return alert.type === 'SOS';
    if (filter === 'HIGH') return alert.severity === 'HIGH';
    return true;
  });

  const handleAlertClick = (alert: Alert) => {
    setActiveAlert(alert);
    onAlertClick?.(alert);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Simple distance calculation (in km)
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="alert-map-container">
      {/* Map Controls */}
      <div className="alert-map-controls">
        <div className="filter-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All Alerts ({alerts.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'SOS' ? 'active' : ''}`}
              onClick={() => setFilter('SOS')}
            >
              🚨 SOS ({alerts.filter(a => a.type === 'SOS').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'HIGH' ? 'active' : ''}`}
              onClick={() => setFilter('HIGH')}
            >
              🔴 High ({alerts.filter(a => a.severity === 'HIGH').length})
            </button>
          </div>

          {realTime && (
            <div className="real-time-indicator">
              <span className="pulse-dot"></span>
              <span>Live Updates</span>
            </div>
          )}
        </div>

        <div className="map-info">
          <div className="info-item">
            <span className="info-label">Total Alerts:</span>
            <span className="info-value">{alerts.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Active Now:</span>
            <span className="info-value">
              {alerts.filter(a => {
                const alertTime = new Date(a.timestamp);
                const now = new Date();
                return (now.getTime() - alertTime.getTime()) < 3600000; // Last hour
              }).length}
            </span>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="alert-map-visualization">
        <div className="map-grid">
          {/* Simulated map with alert markers */}
          {filteredAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className="alert-marker"
              style={{
                left: `${((alert.lng + 180) / 360) * 100}%`,
                top: `${((90 - alert.lat) / 180) * 100}%`,
                backgroundColor: getSeverityColor(alert.severity),
                animationDelay: `${index * 0.1}s`,
              }}
              onClick={() => handleAlertClick(alert)}
              title={`${alert.type} - ${alert.severity}`}
            >
              <div className="marker-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="marker-pulse"></div>
              
              {/* Distance from user (if location available) */}
              {userLocation && (
                <div className="distance-badge">
                  {calculateDistance(userLocation.lat, userLocation.lng, alert.lat, alert.lng).toFixed(1)}km
                </div>
              )}
            </div>
          ))}
          
          {/* User location marker */}
          {userLocation && (
            <div
              className="user-location-marker"
              style={{
                left: `${((userLocation.lng + 180) / 360) * 100}%`,
                top: `${((90 - userLocation.lat) / 180) * 100}%`,
              }}
              title="Your location"
            >
              <div className="user-marker">📍</div>
              <div className="user-radius"></div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Details Panel */}
      {activeAlert && (
        <div className="alert-details-panel">
          <div className="panel-header">
            <h4>Alert Details</h4>
            <button 
              className="close-panel-btn"
              onClick={() => setActiveAlert(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="panel-content">
            <div className="alert-type-badge" style={{ backgroundColor: getSeverityColor(activeAlert.severity) }}>
              {getAlertIcon(activeAlert.type)} {activeAlert.type}
            </div>
            
            <div className="alert-info">
              <div className="info-row">
                <span className="info-label">Severity:</span>
                <span className="info-value">{activeAlert.severity}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">
                  {activeAlert.lat.toFixed(4)}, {activeAlert.lng.toFixed(4)}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Time:</span>
                <span className="info-value">
                  {new Date(activeAlert.timestamp).toLocaleString()}
                </span>
              </div>
              
              {userLocation && (
                <div className="info-row">
                  <span className="info-label">Distance from you:</span>
                  <span className="info-value">
                    {calculateDistance(userLocation.lat, userLocation.lng, activeAlert.lat, activeAlert.lng).toFixed(1)} km
                  </span>
                </div>
              )}
              
              {activeAlert.description && (
                <div className="info-row">
                  <span className="info-label">Description:</span>
                  <p className="info-description">{activeAlert.description}</p>
                </div>
              )}
            </div>
            
            <div className="alert-actions">
              <button className="action-btn view">View Details</button>
              {activeAlert.type === 'SOS' && (
                <button className="action-btn respond">Respond</button>
              )}
              <button className="action-btn directions">Get Directions</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert List */}
      <div className="alert-list-sidebar">
        <h5>Recent Alerts</h5>
        <div className="alert-items">
          {filteredAlerts.slice(0, 5).map(alert => (
            <div 
              key={alert.id}
              className={`alert-item ${activeAlert?.id === alert.id ? 'active' : ''}`}
              onClick={() => handleAlertClick(alert)}
            >
              <div className="alert-item-header">
                <span className="alert-item-type">{getAlertIcon(alert.type)}</span>
                <span className="alert-item-severity" style={{ color: getSeverityColor(alert.severity) }}>
                  {alert.severity}
                </span>
                <span className="alert-item-time">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="alert-item-location">
                📍 {alert.lat.toFixed(3)}, {alert.lng.toFixed(3)}
              </div>
              
              {userLocation && (
                <div className="alert-item-distance">
                  {calculateDistance(userLocation.lat, userLocation.lng, alert.lat, alert.lng).toFixed(1)} km away
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredAlerts.length > 5 && (
          <button className="view-all-btn">
            View All Alerts ({filteredAlerts.length})
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <button className="quick-action-btn" onClick={() => window.location.href = '/emergency'}>
          🚨 Send SOS
        </button>
        <button className="quick-action-btn" onClick={() => window.location.href = '/reports'}>
          📝 Report Incident
        </button>
        <button className="quick-action-btn" onClick={() => {
          if (userLocation) {
            navigator.clipboard.writeText(`${userLocation.lat}, ${userLocation.lng}`);
            alert('Location copied to clipboard!');
          }
        }}>
          📍 Share Location
        </button>
      </div>
    </div>
  );
};

export default AlertMap;