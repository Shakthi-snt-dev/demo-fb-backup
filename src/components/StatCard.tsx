import React from 'react';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  icon,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#E0E7F1] overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Bird-blue accent line on top */}
      <div className="h-1 bg-[#007BFF]" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#4A5568] mb-2">{title}</p>
            <p className="text-3xl font-bold text-[#1A1F36]">{value}</p>
          </div>
          {icon && (
            <div className="text-[#007BFF] opacity-80">
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="flex items-center gap-1.5">
            {trend.isPositive ? (
              <HiArrowTrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <HiArrowTrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
            <span className="text-sm text-[#4A5568]">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

