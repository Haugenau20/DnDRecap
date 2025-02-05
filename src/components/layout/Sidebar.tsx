// components/layout/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sidebar component that provides contextual navigation based on current route.
 */
const Sidebar: React.FC = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/story':
        return <div>Story Navigation</div>;
      case '/quests':
        return <div>Quest Filters</div>;
      case '/npcs':
        return <div>NPC Filters</div>;
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 bg-gray-200 p-4 hidden md:block">
      {renderContent()}
    </aside>
  );
};

export default Sidebar;