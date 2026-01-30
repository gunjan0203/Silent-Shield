import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`input-container ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      
      <div className={`input-wrapper ${error ? 'has-error' : ''} ${icon ? 'has-icon' : ''}`}>
        {icon && iconPosition === 'left' && (
          <span className="input-icon-left">{icon}</span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${iconPosition === 'right' ? 'icon-right' : ''}`}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <span className="input-icon-right">{icon}</span>
        )}
      </div>
      
      {error && (
        <div className="input-error">{error}</div>
      )}
      
      {helperText && !error && (
        <div className="input-helper">{helperText}</div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;