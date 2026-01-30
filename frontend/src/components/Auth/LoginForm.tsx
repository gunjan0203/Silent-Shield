import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './LoginForm.css';

const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToVolunteer?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignup,
  onSwitchToVolunteer,
}) => {
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setServerError('');
      
      // Backend connectivity - same as in login.tsx
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setServerError(responseData.detail || 'Login failed');
        return;
      }

      // Store the token if your backend returns one
      if (responseData.access_token) {
        localStorage.setItem('token', responseData.access_token);
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(responseData.user || {}));
      }

      // Navigate to dashboard
      navigate('/dashboard');
      
      // Call success callback if provided
      onSuccess?.();
      
    } catch (err: any) {
      setServerError('Backend not reachable or login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    // Navigate to signup form page
    navigate('/signup');
    // Call the prop callback if provided
    onSwitchToSignup?.();
  };

  const handleBecomeVolunteerClick = () => {
    // Navigate to volunteer signup form page
    navigate('/volunteer-signup');
    // Call the prop callback if provided
    onSwitchToVolunteer?.();
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Welcome Back</h2>
      <p className="auth-form-subtitle">Sign in to your Silent Shield account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        {serverError && (
          <div className="auth-form-error">
            {serverError}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          icon="📧"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
          fullWidth
        />

        <Input
          label="Password"
          type="password"
          icon="🔒"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
          fullWidth
        />

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button type="button" className="forgot-password-btn">
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          icon="→"
          iconPosition="right"
        >
          Sign In
        </Button>
      </form>

      <div className="auth-form-footer">
        <p className="switch-auth-text">
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={handleSignUpClick}
            className="switch-auth-btn"
          >
            Sign up
          </button>
        </p>
        
        <p className="switch-auth-text">
          Want to help others?{' '}
          <button 
            type="button" 
            onClick={handleBecomeVolunteerClick}
            className="switch-auth-btn volunteer"
          >
            Become a Volunteer
          </button>
        </p>

        <div className="guest-access">
          <p>Need immediate help?</p>
          <Button
            type="button"
            variant="danger"
            fullWidth
            icon="🚨"
            onClick={() => window.location.href = '/emergency'}
          >
            Emergency SOS (Guest Access)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;