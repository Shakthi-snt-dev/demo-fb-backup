import React from 'react';
import { HiMagnifyingGlass, HiBell } from 'react-icons/hi2';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E7F1] px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-[#F5F8FF] transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-[#4A5568]"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]/60" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-[#E0E7F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent bg-[#F5F8FF]"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-[#F5F8FF] transition-colors relative"
            aria-label="Notifications"
          >
            <HiBell className="w-6 h-6 text-[#4A5568]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#0065D1] transition-colors">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

