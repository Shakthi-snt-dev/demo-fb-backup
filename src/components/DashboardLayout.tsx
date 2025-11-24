import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Show sidebar by default on tablet/desktop (md breakpoint and above)
  useEffect(() => {
    // Initialize sidebar state based on screen size
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Tablet/Desktop: ensure sidebar is visible
        setSidebarOpen(true);
      } else {
        // Mobile: hide sidebar when resizing to mobile
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
      {/* Top Navigation Header */}
      <TopHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden mt-14">
        {/* Mobile/Tablet Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ top: '56px' }}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed left-0 z-50 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
          style={{ top: '56px', height: 'calc(100vh - 56px)' }}
        >
          <Sidebar 
            isCollapsed={sidebarCollapsed}
            onCollapseChange={setSidebarCollapsed}
            onMobileClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-20 lg:pl-20' : 'md:pl-64 lg:pl-64'} pt-0`}>
          <main className="p-4 lg:p-6 min-h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

