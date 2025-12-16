import React from 'react';
import { ReactNode } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'hero';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[padding];

  const variantClasses = {
    default: 'rounded-2xl',
    hero: 'rounded-3xl'
  }[variant];

  return (
    <div
      className={`glass-card ${paddingClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};