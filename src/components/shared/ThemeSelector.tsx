import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../config/themes';
import { Palette } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change theme"
      >
        <Palette className="w-5 h-5" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 py-2 bg-zinc-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-card-border z-50">
        {Object.values(themes).map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-500 transition-colors ${
              theme.name === t.name ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: t.colors.primary }}
              />
              <span className="capitalize">{t.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;