import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

  const Button: React.FC<ButtonProps> = ({  
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  ...props
  }) => {

  const baseClasses = 'button';
  const variantClasses = `button-${variant}`;
  const sizeClasses = `button-${size}`;
  const widthClass = fullWidth ? 'button-full-width' : '';
  const loadingClass = loading ? 'button-loading' : '';
  const disabledClass = disabled ? 'button-disabled' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button-spinner"></span>}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="button-icon-left">{icon}</span>
      )}
      
      <span className="button-text">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="button-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;