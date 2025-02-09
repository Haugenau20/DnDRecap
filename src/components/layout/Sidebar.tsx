// components/layout/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import StorySidebar from './sidebars/StorySidebar';
import QuestSidebar from './sidebars/QuestSidebar';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine which sidebar content to show based on the current route
  const renderSidebarContent = () => {
    if (pathname.startsWith('/story')) {
      return <StorySidebar />;
    }
    
    if (pathname.startsWith('/quests')) {
      return <QuestSidebar />;
    }
    
    // Add other sidebar contents as they are implemented
    return null;
  };

  // Only show sidebar on routes that have sidebar content
  const shouldShowSidebar = null;//pathname.startsWith('/story') || pathname.startsWith('/quests'); // Add other routes as needed

  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto hidden md:block">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;