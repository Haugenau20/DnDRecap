// components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../shared/SearchBar';

/**
 * Header component containing the main navigation and search functionality.
 */
const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          D&D Campaign Companion
        </Link>
        <SearchBar />
        <nav className="hidden md:flex space-x-4">
          <Link to="/story" className="hover:text-gray-300">Story</Link>
          <Link to="/quests" className="hover:text-gray-300">Quests</Link>
          <Link to="/npcs" className="hover:text-gray-300">NPCs</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;