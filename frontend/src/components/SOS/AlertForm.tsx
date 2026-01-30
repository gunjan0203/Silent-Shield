import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './SOS.css';

const alertSchema = z.object({
  code: z.string()
    .min(1, 'Alert code is required')
    .max(10, 'Code is too long'),
  message: z.string()
    .max(255, 'Message is too long')
    .optional(),
  latitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
});

type AlertFormData = z.infer<typeof alertSchema>;

interface AlertFormProps {
  onAlertSent?: (alertData: any) => void;
  mode?: 'user' | 'guest' | 'volunteer';
}

const AlertForm: React.FC<AlertFormProps> = ({
  onAlertSent,
  mode = 'user',
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const alertTypes = [
    { code: 'SOS', label: '🚨 Emergency SOS', description: 'Immediate danger or medical emergency' },
    { code: 'MEDICAL', label: '🏥 Medical Emergency', description: 'Medical assistance needed' },
    { code: 'FIRE', label: '🔥 Fire Emergency', description: 'Fire or smoke spotted' },
    { code: 'POLICE', label: '🚔 Police Required', description: 'Crime or suspicious activity' },
    { code: 'SAFETY', label: '⚠️ Safety Concern', description: 'Unsafe area or situation' },
    { code: 'OTHER', label: '📢 Other Alert', description: 'Other type of emergency' },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      code: 'SOS',
      latitude: 0,
      longitude: 0,
    },
  });

  const selectedCode = watch('code');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        setLocation(newLocation);
        setValue('latitude', newLocation.lat);
        setValue('longitude', newLocation.lng);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        setIsGettingLocation(false);
        
        // Set default location (Delhi)
        const defaultLocation = { lat: 28.6139, lng: 77.2090 };
        setLocation(defaultLocation);
        setValue('latitude', defaultLocation.lat);
        setValue('longitude', defaultLocation.lng);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualLocation = () => {
    const lat = parseFloat(prompt('Enter latitude:') || '0');
    const lng = parseFloat(prompt('Enter longitude:') || '0');
    
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ lat, lng });
      setValue('latitude', lat);
      setValue('longitude', lng);
      setLocationError('');
    }
  };

  const onSubmit = async (data: AlertFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      setSubmitSuccess('');

      // Determine endpoint based on mode
      let endpoint = '/alerts/';
      if (mode === 'guest') endpoint = '/alerts/guest';
      
      const response = await api.post(endpoint, data);
      
      setSubmitSuccess(`Alert sent successfully! Panic level: ${response.data.panic_level || 'HIGH'}`);
      reset({ code: 'SOS', message: '' });
      onAlertSent?.(response.data);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess('');
      }, 5000);
      
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.detail || 
        'Failed to send alert. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedAlertInfo = () => {
    const selected = alertTypes.find(type => type.code === selectedCode);
    return selected || alertTypes[0];
  };

  return (
    <div className="alert-form-container">
      <div className="alert-form-header">
        <h2>Send Emergency Alert</h2>
        <p className="form-subtitle">
          {mode === 'guest' 
            ? 'Send alert without login. Nearby volunteers will be notified.'
            : 'Send alert to emergency contacts and nearby volunteers.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="alert-form">
        {/* Alert Type Selection */}
        <div className="form-section">
          <label className="section-label">Alert Type *</label>
          <div className="alert-type-grid">
            {alertTypes.map(type => (
              <label 
                key={type.code}
                className={`alert-type-option ${selectedCode === type.code ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  value={type.code}
                  {...register('code')}
                  className="radio-input"
                />
                <div className="option-content">
                  <span className="option-icon">{type.label.split(' ')[0]}</span>
                  <div className="option-text">
                    <span className="option-label">{type.label.split(' ').slice(1).join(' ')}</span>
                    <span className="option-desc">{type.description}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="form-section">
          <Input
            label="Additional Message (Optional)"
            type="text"
            placeholder="Describe the emergency situation"
            error={errors.message?.message}
            {...register('message')}
            fullWidth
          />
          <small className="helper-text">
            Max 255 characters. This will be sent to responders.
          </small>
        </div>

        {/* Location Information */}
        <div className="form-section location-section">
          <div className="section-header">
            <label className="section-label">Location Information *</label>
            <div className="location-actions">
              <button
                type="button"
                className="location-action-btn"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? 'Getting...' : '📍 Refresh Location'}
              </button>
              <button
                type="button"
                className="location-action-btn manual"
                onClick={handleManualLocation}
              >
                📍 Enter Manually
              </button>
            </div>
          </div>

          {locationError && (
            <div className="location-error">{locationError}</div>
          )}

          <div className="location-display">
            <div className="coordinates">
              <div className="coordinate-item">
                <span className="coord-label">Latitude:</span>
                <code className="coord-value">{location?.lat.toFixed(6) || '0.000000'}</code>
              </div>
              <div className="coordinate-item">
                <span className="coord-label">Longitude:</span>
                <code className="coord-value">{location?.lng.toFixed(6) || '0.000000'}</code>
              </div>
            </div>
            
            {location && (
              <div className="map-preview">
                <div className="map-point" style={{ left: '50%', top: '50%' }}>📍</div>
                <div className="map-coordinates">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Alert Info */}
        <div className="alert-info-card">
          <div className="alert-info-header">
            <span className="alert-icon">{getSelectedAlertInfo().label.split(' ')[0]}</span>
            <h4>{getSelectedAlertInfo().label.split(' ').slice(1).join(' ')}</h4>
          </div>
          <p className="alert-description">{getSelectedAlertInfo().description}</p>
          
          <div className="alert-actions">
            <div className="action-item">
              <span className="action-icon">📢</span>
              <span>Notifies nearby volunteers</span>
            </div>
            <div className="action-item">
              <span className="action-icon">👥</span>
              <span>Alerts emergency contacts</span>
            </div>
            {selectedCode === 'SOS' && (
              <div className="action-item urgent">
                <span className="action-icon">⚠️</span>
                <span>HIGH PRIORITY - Immediate response</span>
              </div>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {submitError && (
          <div className="form-error">{submitError}</div>
        )}
        
        {submitSuccess && (
          <div className="form-success">
            <div className="success-icon">✓</div>
            <div className="success-message">{submitSuccess}</div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant={selectedCode === 'SOS' ? 'danger' : 'primary'}
          fullWidth
          loading={isSubmitting}
          icon="🚨"
          iconPosition="right"
          disabled={!location}
        >
          {isSubmitting ? 'Sending Alert...' : `Send ${getSelectedAlertInfo().label.split(' ')[1]} Alert`}
        </Button>

        <div className="form-note">
          <p>⚠️ <strong>Important:</strong> Only use for real emergencies. False alerts waste valuable resources.</p>
          {mode === 'guest' && (
            <p>🔐 For additional features and saved emergency contacts, <a href="/signup">create an account</a>.</p>
          )}
        </div>
      </form>

      {/* Emergency Contacts Quick Access */}
      <div className="emergency-quick-access">
        <h4>Quick Emergency Numbers:</h4>
        <div className="quick-numbers">
          <button className="emergency-number-btn" onClick={() => window.open('tel:100')}>
            🚔 Police: 100
          </button>
          <button className="emergency-number-btn" onClick={() => window.open('tel:108')}>
            🏥 Ambulance: 108
          </button>
          <button className="emergency-number-btn" onClick={() => window.open('tel:1091')}>
            👩 Women Helpline: 1091
          </button>
          <button className="emergency-number-btn" onClick={() => window.open('tel:1098')}>
            👶 Child Helpline: 1098
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertForm;