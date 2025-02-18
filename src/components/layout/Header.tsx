// components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../shared/SearchBar';
import ThemeSelector from '../shared/ThemeSelector';
import { useNavigation } from '../../hooks/useNavigation';

const Header: React.FC = () => {
  const { navigateToPage } = useNavigation();

  return (
    <header className="bg-gradient-to-r from-stone-600 via-stone-700 to-zinc-800 text-white p-4">
      <div className="container mx-auto flex items-center gap-4 justify-between">
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
        
        <div className="flex-1 max-w-3xl mx-4">
          <SearchBar />
        </div>
        
        <ThemeSelector />
      </div>
    </header>
  );
};

export default Header;