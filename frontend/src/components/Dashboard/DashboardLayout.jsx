import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Dashboard from '../Dashboard'; // Your existing dashboard component

const DashboardLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardLayout;
