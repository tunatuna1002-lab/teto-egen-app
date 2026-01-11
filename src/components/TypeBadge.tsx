import React from 'react';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ 
  type, 
  size = 'md',
  className = '' 
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case '테토형':
        return 'bg-gradient-to-r from-pink-400 to-pink-500 text-white';
      case '에겐형':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
      case '반반(믹스형)':
        return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }[size];

  return (
    <span className={`${sizeClasses} ${getTypeColor(type)} rounded-full font-semibold ${className}`}>
      {type}
    </span>
  );
};