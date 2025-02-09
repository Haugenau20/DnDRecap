// src/components/layout/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import StorySidebar from './sidebars/StorySidebar';
import QuestSidebar from './sidebars/QuestSidebar';
import buildConfig from '../../config/buildConfig';

const Sidebar: React.FC = () => {
  // If sidebar feature is disabled, don't render anything
  if (!buildConfig.features.enableSidebar) {
    return null;
  }

  const location = useLocation();
  const pathname = location.pathname;

  const renderSidebarContent = () => {
    if (pathname.startsWith('/story')) {
      return <StorySidebar />;
    }
    
    if (pathname.startsWith('/quests')) {
      return <QuestSidebar />;
    }
    
    return null;
  };

  const shouldShowSidebar = pathname.startsWith('/story') || pathname.startsWith('/quests');

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