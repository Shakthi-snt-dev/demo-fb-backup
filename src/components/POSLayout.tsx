import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiMoon, FiSun, FiLayout } from 'react-icons/fi';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../Slices/Login/Login-slice';
import { useDarkMode } from '../contexts/DarkModeContext';
import TopHeader from './TopHeader';

interface POSLayoutProps {
  children: React.ReactNode;
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setShowProfileMenu(false);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
      {/* Top Navigation Header */}
      <TopHeader />

      {/* Full Page Content */}
      <main className="flex-1 overflow-hidden min-h-0 mt-14">
        {children}
      </main>
    </div>
  );
};

export default POSLayout;

