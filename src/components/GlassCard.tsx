import React from 'react';
import { ReactNode } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'hero' | 'ultra';
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
    default: 'glass-card',
    hero: 'glass-card rounded-[2rem]',
    ultra: 'glass-panel-ultra'
  }[variant];

  return (
    <div
      className={`${paddingClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};