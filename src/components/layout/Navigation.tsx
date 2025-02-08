// components/layout/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../hooks/useNavigation';
import Typography from '../core/Typography';
import { Book, Scroll, Users, MapPin } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

/**
 * Main navigation component for the application
 * Provides navigation links and highlights active routes
 */
const Navigation: React.FC = () => {
  const { isActivePath, isParentPath } = useNavigation();

  const navItems: NavItem[] = [
    { 
      label: 'Story', 
      path: '/story',
      icon: <Book className="w-5 h-5" />
    },
    { 
      label: 'Quests', 
      path: '/quests',
      icon: <Scroll className="w-5 h-5" />
    },
    { 
      label: 'NPCs', 
      path: '/npcs',
      icon: <Users className="w-5 h-5" />
    },
    { 
      label: 'Locations', 
      path: '/locations',
      icon: <MapPin className="w-5 h-5" />
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path) || isParentPath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.icon}
                  <Typography
                    variant="body"
                    className={isActive ? 'font-medium' : ''}
                  >
                    {item.label}
                  </Typography>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path) || isParentPath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 min-w-0 text-sm ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  <Typography
                    variant="body-sm"
                    className={`mt-1 ${isActive ? 'font-medium' : ''}`}
                  >
                    {item.label}
                  </Typography>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;