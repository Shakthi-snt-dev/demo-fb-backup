import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HiMagnifyingGlass, 
  HiBell, 
  HiEllipsisVertical,
  HiChevronDown,
  HiBars3
} from 'react-icons/hi2';
import { 
  HiArrowsExpand
} from 'react-icons/hi';
import { FiHeadphones } from 'react-icons/fi';

interface TopHeaderProps {
  currentPath?: string;
  onMenuClick?: () => void;
}

type NavItemBase = {
  name: string;
  path: string;
  hasDropdown: boolean;
};

type NavItemWithDropdown = NavItemBase & {
  hasDropdown: true;
  ref: React.RefObject<HTMLDivElement | null>;
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
};

type NavItemWithoutDropdown = NavItemBase & {
  hasDropdown: false;
};

type NavItem = NavItemWithDropdown | NavItemWithoutDropdown;

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRepairsDropdown, setShowRepairsDropdown] = useState(false);
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [showExpenseDropdown, setShowExpenseDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const repairsRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const expenseRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (repairsRef.current && !repairsRef.current.contains(event.target as Node)) {
        setShowRepairsDropdown(false);
      }
      if (inventoryRef.current && !inventoryRef.current.contains(event.target as Node)) {
        setShowInventoryDropdown(false);
      }
      if (customerRef.current && !customerRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
      if (reportsRef.current && !reportsRef.current.contains(event.target as Node)) {
        setShowReportsDropdown(false);
      }
      if (expenseRef.current && !expenseRef.current.contains(event.target as Node)) {
        setShowExpenseDropdown(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems: NavItem[] = [
    { name: 'Repairs', path: '/dashboard/repairs', hasDropdown: true, ref: repairsRef, showDropdown: showRepairsDropdown, setShowDropdown: setShowRepairsDropdown },
    { name: 'Inventory', path: '/dashboard/inventory', hasDropdown: true, ref: inventoryRef, showDropdown: showInventoryDropdown, setShowDropdown: setShowInventoryDropdown },
    { name: 'Customer', path: '/dashboard/customers', hasDropdown: true, ref: customerRef, showDropdown: showCustomerDropdown, setShowDropdown: setShowCustomerDropdown },
    { name: 'Point Of Sale', path: '/dashboard/pos', hasDropdown: false },
    { name: 'Reports', path: '/dashboard/reports', hasDropdown: true, ref: reportsRef, showDropdown: showReportsDropdown, setShowDropdown: setShowReportsDropdown },
    { name: 'Campaigner', path: '/dashboard/campaigner', hasDropdown: false },
    { name: 'Expense', path: '/dashboard/expense', hasDropdown: true, ref: expenseRef, showDropdown: showExpenseDropdown, setShowDropdown: setShowExpenseDropdown },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-14 border-t border-gray-300/30 z-[60]" style={{ backgroundColor: 'rgba(7,126,242,1)' }}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center gap-4 md:gap-6 h-full">
          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Toggle menu"
          >
            <HiBars3 className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="text-white font-bold text-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            Flow tap
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative h-full"
                ref={item.hasDropdown ? item.ref : undefined}
              >
                <button
                  onClick={() => {
                    if (!item.hasDropdown) {
                      navigate(item.path);
                    } else {
                      item.setShowDropdown(!item.showDropdown);
                    }
                  }}
                  className={`h-full px-4 flex items-center gap-1.5 text-white text-sm font-medium hover:bg-white/10 transition-colors ${
                    isActive(item.path) 
                      ? 'bg-white/10 border-b-2 border-teal-300' 
                      : ''
                  }`}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <HiChevronDown className={`w-4 h-4 transition-transform ${item.showDropdown ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.showDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] z-50">
                    <button
                      onClick={() => {
                        navigate(item.path);
                        item.setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {item.name} Overview
                    </button>
                    <button
                      onClick={() => {
                        item.setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {item.name} Settings
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Side - Icons and Actions */}
        <div className="flex items-center gap-3">
          {/* Fullscreen Icon */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Toggle fullscreen"
          >
            <HiArrowsExpand className="w-5 h-5" />
          </button>

          {/* Search Icon */}
          <button
            className="p-2 text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Search"
          >
            <HiMagnifyingGlass className="w-5 h-5" />
          </button>

          {/* Contact Support Button */}
          <button className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded flex items-center gap-2 text-sm font-medium transition-colors">
            <FiHeadphones className="w-4 h-4" />
            <span className="hidden sm:inline">Contact Support</span>
            <HiChevronDown className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* Percentage Icon */}
          <button
            className="w-10 h-10 rounded-full border-2 border-white/50 text-white flex items-center justify-center text-sm font-medium hover:bg-white/10 transition-colors"
            aria-label="Percentage"
          >
            0%
          </button>

          {/* Notification Bell */}
          <button
            className="relative p-2 text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Notifications"
          >
            <HiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* More Options (Kebab Menu) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 text-white hover:bg-white/10 rounded transition-colors"
              aria-label="More options"
            >
              <HiEllipsisVertical className="w-5 h-5" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    navigate('/dashboard/settings');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Help & Support
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;

