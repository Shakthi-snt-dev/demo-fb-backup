import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi2';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    path?: string;
  }>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-sm text-[#4A5568] flex items-center gap-2 mb-4">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1 text-[#4A5568]/60 hover:text-[#007BFF] transition-colors"
      >
        <HiHome className="w-4 h-4" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-[#4A5568]/60">|</span>
          {item.path ? (
            <Link 
              to={item.path}
              className="text-[#4A5568]/60 hover:text-[#007BFF] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1A1F36] font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

