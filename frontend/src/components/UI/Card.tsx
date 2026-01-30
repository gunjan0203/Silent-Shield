import React from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  headerAction,
  variant = 'default',
  className = '',
}) => {
  const cardClasses = `card card-${variant} ${className}`;

  return (
    <div className={cardClasses}>
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="card-header-action">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;