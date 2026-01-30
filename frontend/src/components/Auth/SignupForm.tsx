import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './SignupForm.css';

const signupSchema = z.object({
  full_name: z.string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain letters and numbers'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['USER', 'VOLUNTEER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMessage('');

      // Remove confirmPassword and prepare data for backend
      const { confirmPassword, ...signupData } = data;
      
      // Backend connectivity - same as in signup.tsx
      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        if (Array.isArray(responseData.detail)) {
          setServerError(responseData.detail.map((e: any) => e.msg).join(', '));
        } else {
          setServerError(String(responseData.detail || 'Signup failed'));
        }
        return;
      }

      // Store the token if your backend returns one
      if (responseData.access_token) {
        localStorage.setItem('token', responseData.access_token);
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(responseData.user || {}));
      }

      setSuccessMessage('Account created successfully!');
      reset();
      
      // Navigate to dashboard after successful signup
      setTimeout(() => {
        navigate('/dashboard');
        onSuccess?.();
      }, 1500);
      
    } catch {
      setServerError('Backend not reachable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = () => {
    // Navigate to login page
    navigate('/login');
    // Call the prop callback if provided
    onSwitchToLogin?.();
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Create Account</h2>
      <p className="auth-form-subtitle">Join Silent Shield to stay safe</p>

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
          <Input
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
          <Input
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
          <Input
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
          <Input
            label="Confirm Password"
            type="password"
            icon="🔒"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            fullWidth
          />
        </div>

        <div className="form-row">
          <label className="form-label">Account Type</label>
          <div className="role-selection">
            <label className={`role-option ${selectedRole === 'USER' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="USER"
                {...register('role')}
              />
              <div className="role-content">
                <span className="role-icon">👤</span>
                <div className="role-info">
                  <span className="role-title">Regular User</span>
                  <span className="role-desc">Use safety features</span>
                </div>
              </div>
            </label>

            <label className={`role-option ${selectedRole === 'VOLUNTEER' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="VOLUNTEER"
                {...register('role')}
              />
              <div className="role-content">
                <span className="role-icon">🤝</span>
                <div className="role-info">
                  <span className="role-title">Volunteer</span>
                  <span className="role-desc">Help others in need</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="form-agreement">
          <label>
            <input type="checkbox" required />
            <span>
              I agree to the{' '}
              <a href="/terms" className="terms-link">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="terms-link">Privacy Policy</a>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          icon="✓"
          iconPosition="right"
        >
          Create Account
        </Button>
      </form>

      <div className="auth-form-footer">
        <p className="switch-auth-text">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={handleSignInClick}
            className="switch-auth-btn"
          >
            Sign in
          </button>
        </p>

        <div className="signup-benefits">
          <h4>Why Sign Up?</h4>
          <ul>
            <li>🚨 Send emergency alerts with your location</li>
            <li>🗺️ View safety heatmaps in your area</li>
            <li>📝 File anonymous safety reports</li>
            <li>👥 Connect with verified volunteers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;