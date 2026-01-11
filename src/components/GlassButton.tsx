import React from 'react';
import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  style,
  'aria-label': ariaLabel
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }[size];

  const variantClasses = {
    primary: 'glass-button-primary',
    secondary: 'glass-button-secondary'
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
      className={`${sizeClasses} ${variantClasses} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
    >
      {children}
    </button>
  );
};