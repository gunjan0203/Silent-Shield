import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/auth';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './VolunteerSignupForm.css';

const volunteerSignupSchema = z.object({
  full_name: z.string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .min(10, 'Please enter a valid phone number'),
  city: z.string()
    .min(1, 'City is required'),
});

type VolunteerSignupFormData = z.infer<typeof volunteerSignupSchema>;

interface VolunteerSignupFormProps {
  onSuccess?: () => void;
  onSwitchToRegular?: () => void;
}

const VolunteerSignupForm: React.FC<VolunteerSignupFormProps> = ({
  onSuccess,
  onSwitchToRegular,
}) => {
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoError, setIdPhotoError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VolunteerSignupFormData>({
    resolver: zodResolver(volunteerSignupSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setIdPhotoError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setIdPhotoError('File size should be less than 5MB');
        return;
      }
      
      setIdPhoto(file);
      setIdPhotoError('');
    }
  };

  const onSubmit = async (data: VolunteerSignupFormData) => {
    // Validate ID photo
    if (!idPhoto) {
      setIdPhotoError('Please upload your ID photo');
      return;
    }

    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMessage('');

      const volunteerData = {
        ...data,
        id_photo: idPhoto,
      };
      
      await authService.volunteerSignup(volunteerData);

      setSuccessMessage('Volunteer application submitted! We will verify your details and contact you soon.');
      reset();
      setIdPhoto(null);
      
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error: any) {
      setServerError(
        error.response?.data?.detail || 
        error.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container volunteer-form">
      <div className="volunteer-badge">
        🤝 Volunteer Registration
      </div>
      
      <h2 className="auth-form-title">Become a Volunteer</h2>
      <p className="auth-form-subtitle">
        Help keep your community safe. Verified volunteers receive alerts and can respond to emergencies.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        {serverError && (
          <div className="auth-form-error">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="auth-form-success">
            {successMessage}
          </div>
        )}

        <div className="form-row">
          <Input className="text-input"
            label="Full Name"
            type="text"
            icon="👤"
            placeholder="Enter your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
            fullWidth
          />
        </div>

        <div className="form-row">
          <Input className="text-input"
            label="Email Address"
            type="email"
            icon="📧"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
            fullWidth
          />
        </div>

        <div className="form-row">
          <Input className="text-input"
            label="Password"
            type="password"
            icon="🔒"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
            fullWidth
          />
        </div>

        <div className="form-row">
          <Input className="text-input"
            label="Phone Number"
            type="tel"
            icon="📱"
            placeholder="Enter your phone number"
            error={errors.phone?.message}
            {...register('phone')}
            fullWidth
          />
        </div>

        <div className="form-row">
          <Input className="text-input"
            label="City"
            type="text"
            icon="🏙️"
            placeholder="Enter your city"
            error={errors.city?.message}
            {...register('city')}
            fullWidth
          />
        </div>

        <div className="form-row">
          <label className="form-label">
            ID Proof Photo *
            <span className="required-star">*</span>
          </label>
          
          <div className="file-upload-area">
            <input 
              type="file"
              id="id-photo"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="id-photo" className="file-upload-label">
              {idPhoto ? (
                <div className="file-preview">
                  <span className="file-icon">📷</span>
                  <div className="file-info">
                    <span className="file-name">{idPhoto.name}</span>
                    <span className="file-size">
                      {(idPhoto.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button 
                    type="button"
                    className="remove-file-btn"
                    onClick={() => setIdPhoto(null)}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="upload-icon">📤</span>
                  <div className="upload-text">
                    <strong>Click to upload ID proof</strong>
                    <span>Supports: JPG, PNG (Max 5MB)</span>
                  </div>
                </>
              )}
            </label>
          </div>
          
          {idPhotoError && (
            <div className="input-error">{idPhotoError}</div>
          )}
          
          <div className="file-requirements">
            <small>
              Upload a clear photo of your government ID (Aadhar, Driving License, Passport, etc.)
              for verification.
            </small>
          </div>
        </div>

        <div className="form-agreement volunteer-agreement">
          <label>
            <input type="checkbox" required />
            <span>
              I agree to act responsibly as a volunteer and maintain confidentiality of sensitive information.
              I understand that I may be contacted in emergencies and agree to respond promptly when available.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          icon="🤝"
          iconPosition="right"
        >
          Submit Volunteer Application
        </Button>
      </form>

      <div className="volunteer-benefits">
        <h4>Volunteer Benefits:</h4>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">🎖️</span>
            <div className="benefit-content">
              <strong>Verified Status</strong>
              <small>Get verified badge and recognition</small>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🔔</span>
            <div className="benefit-content">
              <strong>Emergency Alerts</strong>
              <small>Receive real-time emergency notifications</small>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🏆</span>
            <div className="benefit-content">
              <strong>Recognition</strong>
              <small>Get certificates and appreciation</small>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🤝</span>
            <div className="benefit-content">
              <strong>Community</strong>
              <small>Join network of safety volunteers</small>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-footer">
        <p className="switch-auth-text">
          Regular user?{' '}
          <button 
            type="button" 
            onClick={onSwitchToRegular}
            className="switch-auth-btn"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default VolunteerSignupForm;