// components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../shared/SearchBar';
import { useNavigation } from '../../hooks/useNavigation';

/**
 * Header component containing branding and search functionality.
 */
const Header: React.FC = () => {
  const { navigateToPage } = useNavigation();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          onClick={(e) => {
            e.preventDefault();
            navigateToPage('/');
          }}
          className="text-xl font-bold"
        >
          D&D Campaign Companion
        </Link>
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;