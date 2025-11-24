import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiHome, 
  HiShoppingCart, 
  HiCube, 
  HiWrenchScrewdriver,
  HiUserGroup,
  HiUsers,
  HiChatBubbleLeftRight,
  HiChartBar,
  HiCog6Tooth,
  HiChevronLeft,
  HiChevronRight,
  HiXMark,
  HiMagnifyingGlass,
  HiChevronDown
} from 'react-icons/hi2';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  hasDropdown?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: HiHome },
  { name: 'POS', path: '/dashboard/pos', icon: HiShoppingCart },
  { name: 'Inventory', path: '/dashboard/inventory', icon: HiCube, hasDropdown: true },
  { name: 'Repairs', path: '/dashboard/repairs', icon: HiWrenchScrewdriver },
  { name: 'Customers', path: '/dashboard/customers', icon: HiUserGroup },
  { name: 'Employees', path: '/dashboard/employees', icon: HiUsers, hasDropdown: true },
  { name: 'Messages', path: '/dashboard/messages', icon: HiChatBubbleLeftRight },
  { name: 'Reports', path: '/dashboard/reports', icon: HiChartBar },
  { name: 'Settings', path: '/dashboard/settings', icon: HiCog6Tooth },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  onCollapseChange,
  onMobileClose 
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Determine the blue color - using a solid blue similar to the image
  // Using a vibrant blue that matches the image description
  const sidebarBlue = '#2563EB'; // A solid vibrant blue color

  return (
    <aside
      className={`
        h-full transition-all duration-300 flex-shrink-0
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
      style={{ backgroundColor: sidebarBlue }}
    >
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        {!isCollapsed && (
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Settings"
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder:text-white/60 text-sm font-normal"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}

        {/* Mobile/Tablet Close Button */}
        {onMobileClose && (
          <div className="md:hidden flex items-center justify-end p-4 border-b border-white/10">
            <button
              onClick={onMobileClose}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <HiXMark className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Desktop Collapse Button */}
        {onCollapseChange && !isCollapsed && (
          <div className="hidden md:flex items-center justify-end p-2 border-b border-white/10">
            <button
              onClick={() => onCollapseChange(!isCollapsed)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Collapse sidebar"
            >
              <HiChevronLeft className="w-5 h-5 text-white/80" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group
                      ${isActive 
                        ? 'bg-white/15 text-white shadow-sm' 
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/75 group-hover:text-white'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium text-sm flex-1 leading-tight" style={{ fontFamily: 'inherit' }}>{item.name}</span>
                        {item.hasDropdown && (
                          <HiChevronDown className="w-4 h-4 text-white/60 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Button for Collapsed State */}
        {onCollapseChange && isCollapsed && (
          <div className="hidden md:flex items-center justify-center p-2 border-t border-white/10">
            <button
              onClick={() => onCollapseChange(!isCollapsed)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Expand sidebar"
            >
              <HiChevronRight className="w-5 h-5 text-white/80" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

