import React from 'react';

interface ScoreBarProps {
  label: string;
  score: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  color = '#6B7CFF',
  size = 'md',
  showValue = true
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }[size];

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className={`${textClasses} font-medium text-charcoal-light`}>
          {label}
        </span>
        {showValue && (
          <span className={`${textClasses} font-bold text-charcoal`}>
            {score}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${sizeClasses} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${score}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};