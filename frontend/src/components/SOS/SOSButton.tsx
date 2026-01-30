import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './SOS.css';

interface SOSButtonProps {
  variant?: 'default' | 'large' | 'floating';
  showConfirmation?: boolean;
  onAlertSent?: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({
  variant = 'default',
  showConfirmation = true,
  onAlertSent,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const startCountdown = () => {
    if (!location && !error) {
      setError('Getting your location... Please wait.');
      return;
    }

    if (error) {
      if (window.confirm('Location error. Send alert with approximate location?')) {
        sendSOSAlert();
      }
      return;
    }

    setIsActive(true);
    setCountdown(5);
  };

  const cancelSOS = () => {
    setIsActive(false);
    setCountdown(5);
  };

  const sendSOSAlert = async () => {
    try {
      setIsSending(true);
      setError('');
      
      const alertData = {
        code: 'SOS',
        message: 'Emergency SOS activated',
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
      };

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const endpoint = token ? '/alerts/' : '/alerts/guest';

      await api.post(endpoint, alertData);
      
      setSuccess(true);
      onAlertSent?.();
      
      // Play emergency sound
      playEmergencySound();
      
      // Vibrate device if supported
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
      
      // Show success message
      setTimeout(() => {
        setSuccess(false);
        setIsActive(false);
      }, 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send SOS alert. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const playEmergencySound = () => {
    try {
      // Create emergency sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isActive && countdown === 0) {
      sendSOSAlert();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, countdown]);

  const getButtonClasses = () => {
    let classes = 'sos-button';
    
    if (variant === 'large') classes += ' sos-large';
    if (variant === 'floating') classes += ' sos-floating';
    if (isActive) classes += ' sos-active';
    if (isSending) classes += ' sos-sending';
    if (success) classes += ' sos-success';
    
    return classes;
  };

  return (
    <div className="sos-container">
      {/* Emergency Instructions */}
      <div className="sos-instructions">
        <h4>⚠️ Emergency Instructions:</h4>
        <ul>
          <li>Press and hold the SOS button for 5 seconds</li>
          <li>Your location will be shared with emergency contacts</li>
          <li>Nearby volunteers will be notified</li>
          <li>Stay on the line if possible</li>
        </ul>
      </div>

      {/* Main SOS Button */}
      <div className="sos-button-wrapper">
        <button
          className={getButtonClasses()}
          onMouseDown={startCountdown}
          onTouchStart={startCountdown}
          onMouseUp={cancelSOS}
          onTouchEnd={cancelSOS}
          onMouseLeave={cancelSOS}
          disabled={isSending || success}
        >
          {isActive ? (
            <div className="sos-countdown">
              <div className="countdown-number">{countdown}</div>
              <div className="countdown-text">RELEASE TO CANCEL</div>
            </div>
          ) : isSending ? (
            <div className="sos-sending-state">
              <div className="sending-spinner"></div>
              <div>SENDING ALERT...</div>
            </div>
          ) : success ? (
            <div className="sos-success-state">
              <div className="success-icon">✓</div>
              <div>ALERT SENT!</div>
              <div className="success-sub">Help is on the way</div>
            </div>
          ) : (
            <div className="sos-ready-state">
              <div className="sos-icon">🚨</div>
              <div className="sos-label">EMERGENCY SOS</div>
              <div className="sos-sub">Press and hold for 5 seconds</div>
            </div>
          )}
        </button>
        
        {location && (
          <div className="location-info">
            📍 Location ready: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="sos-error">
          {error}
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="emergency-contacts">
        <h5>Emergency Numbers:</h5>
        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-icon">🚔</span>
            <div className="contact-info">
              <span className="contact-name">Police</span>
              <span className="contact-number">100</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🏥</span>
            <div className="contact-info">
              <span className="contact-name">Ambulance</span>
              <span className="contact-number">108</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">👩</span>
            <div className="contact-info">
              <span className="contact-name">Women Helpline</span>
              <span className="contact-number">1091</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">👨‍👩‍👧‍👦</span>
            <div className="contact-info">
              <span className="contact-name">Child Helpline</span>
              <span className="contact-number">1098</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="safety-tips">
        <h5>💡 If in immediate danger:</h5>
        <ul>
          <li>Find a safe location if possible</li>
          <li>Make noise to attract attention</li>
          <li>Use built-in phone emergency features</li>
          <li>Call emergency services directly if safe</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn"
          onClick={() => window.location.href = '/reports'}
        >
          📝 Report Incident
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => navigator.clipboard.writeText(`${location?.lat}, ${location?.lng}`)}
        >
          📍 Copy Location
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => window.location.href = '/profile#contacts'}
        >
          👥 Emergency Contacts
        </button>
      </div>
    </div>
  );
};

export default SOSButton;