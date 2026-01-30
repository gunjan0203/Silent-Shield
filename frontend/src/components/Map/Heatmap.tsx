import React, { useEffect, useRef } from 'react';
import './Map.css';

interface HeatmapProps {
  data: Array<{
    lat: number;
    lng: number;
    intensity: number;
    radius?: number;
  }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationClick?: (lat: number, lng: number) => void;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data,
  center = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  zoom = 12,
  onLocationClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location
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

  // This is a simplified heatmap visualization
  // In a real application, you would use a mapping library like Leaflet or Google Maps

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 0.8) return '#ff0000'; // High risk - Red
    if (intensity >= 0.6) return '#ff6600'; // Medium-High - Orange
    if (intensity >= 0.4) return '#ffcc00'; // Medium - Yellow
    if (intensity >= 0.2) return '#66ff66'; // Low-Medium - Light Green
    return '#00ff00'; // Low risk - Green
  };

  return (
    <div className="heatmap-container">
      <div className="map-controls">
        <div className="map-legend">
          <div className="legend-title">Risk Level</div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ff0000' }}></div>
              <span>High Risk</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ff6600' }}></div>
              <span>Medium-High</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ffcc00' }}></div>
              <span>Medium</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#66ff66' }}></div>
              <span>Low-Medium</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#00ff00' }}></div>
              <span>Low Risk</span>
            </div>
          </div>
        </div>

        <div className="map-tools">
          <button 
            className="map-tool-btn"
            onClick={() => {
              if (userLocation) {
                setUserLocation(userLocation); // This would center map on user in real implementation
              }
            }}
            title="Center on my location"
          >
            📍
          </button>
          <button 
            className="map-tool-btn"
            onClick={() => window.location.href = '/reports'}
            title="Report unsafe area"
          >
            📝
          </button>
          <button 
            className="map-tool-btn"
            onClick={() => window.location.href = '/emergency'}
            title="Send SOS"
          >
            🚨
          </button>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="map-visualization" ref={mapRef}>
        {/* This would be replaced with actual map library */}
        <div className="map-placeholder">
          <div className="map-grid">
            {/* Simulated heatmap points */}
            {data.map((point, index) => (
              <div
                key={index}
                className="heatmap-point"
                style={{
                  left: `${((point.lng + 180) / 360) * 100}%`,
                  top: `${((90 - point.lat) / 180) * 100}%`,
                  backgroundColor: getIntensityColor(point.intensity),
                  opacity: point.intensity,
                  width: `${(point.radius || 20) * point.intensity}px`,
                  height: `${(point.radius || 20) * point.intensity}px`,
                }}
                onClick={() => onLocationClick?.(point.lat, point.lng)}
                title={`Risk intensity: ${Math.round(point.intensity * 100)}%`}
              />
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
                👤
              </div>
            )}
          </div>
          
          {/* Map coordinates display */}
          <div className="coordinates-display">
            <div className="coordinate">
              <span>Center:</span>
              <code>{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</code>
            </div>
            {userLocation && (
              <div className="coordinate">
                <span>Your Location:</span>
                <code>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Statistics */}
      <div className="map-statistics">
        <div className="stat-card">
          <div className="stat-value">{data.length}</div>
          <div className="stat-label">Risk Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {data.filter(d => d.intensity >= 0.6).length}
          </div>
          <div className="stat-label">High Risk Areas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(data.reduce((sum, d) => sum + d.intensity, 0) / data.length * 100) || 0}%
          </div>
          <div className="stat-label">Average Risk</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Date().toLocaleDateString()}
          </div>
          <div className="stat-label">Last Updated</div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="safety-tips">
        <h4>💡 Safety Tips for High Risk Areas:</h4>
        <ul>
          <li>Avoid traveling alone, especially at night</li>
          <li>Stay in well-lit and populated areas</li>
          <li>Keep emergency contacts handy</li>
          <li>Use the SOS button if you feel unsafe</li>
          <li>Report any suspicious activities</li>
        </ul>
      </div>
    </div>
  );
};

export default Heatmap;