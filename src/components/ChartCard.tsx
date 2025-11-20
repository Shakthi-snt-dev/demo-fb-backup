import React from 'react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from './Card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  dateRange?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  dateRange,
  children,
  className = '',
  action,
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#E0E7F1] ${className}`}>
      <div className="p-6 border-b border-[#E0E7F1]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1F36] mb-1">{title}</h3>
            {subtitle && (
              <p className="text-sm text-[#4A5568]">{subtitle}</p>
            )}
            {dateRange && (
              <p className="text-xs text-[#4A5568] mt-1">{dateRange}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;

