// components/layout/Layout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import { useNavigation } from '../../hooks/useNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component that wraps the entire application.
 * Provides consistent layout structure and navigation.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentPath } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <Navigation />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;





