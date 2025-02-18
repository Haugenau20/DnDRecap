// components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../shared/SearchBar';
import { useNavigation } from '../../hooks/useNavigation';

/**
 * Header component containing branding and search functionality.
 */
const Header: React.FC = () => {
  const { navigateToPage, createPath } = useNavigation();

  return (
    <header className="bg-gradient-to-r from-stone-600 via-stone-700 to-zinc-800 text-white p-4">
      <div className="container mx-auto flex items-center gap-4 justify-center">
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