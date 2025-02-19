// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeName, ThemeContextState } from '../types/theme';
import { themes } from '../config/themes';

// Import theme-specific CSS
import '../styles/themes/dnd-theme.css';
import '../styles/themes/default-theme.css';

const ThemeContext = createContext<ThemeContextState | undefined>(undefined);

const THEME_STORAGE_KEY = 'dnd-companion-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return themes[savedTheme as ThemeName] || themes.default;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme.name);
    
    // Update CSS variables
    const root = document.documentElement;
    
    // Set theme name as data attribute for global styling
    root.dataset.theme = currentTheme.name;
    
    // Set theme class on body to enable theme-specific selectors
    document.body.className = '';
    document.body.classList.add(`${currentTheme.name}-theme`);
    
    // Colors
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects like background, text, etc.
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            root.style.setProperty(`--color-${key}-${subKey}`, subValue);
          } else if (typeof subValue === 'object' && subValue !== null) {
            // Handle deeper nesting if needed (like button variants)
            Object.entries(subValue).forEach(([deepKey, deepValue]) => {
              if (typeof deepValue === 'string') {
                root.style.setProperty(`--color-${key}-${subKey}-${deepKey}`, deepValue);
              }
            });
          }
        });
      }
    });
    
    // Fonts
    Object.entries(currentTheme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
    
    // Borders
    Object.entries(currentTheme.borders).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            root.style.setProperty(`--border-${key}-${subKey}`, subValue);
          }
        });
      }
    });
  }, [currentTheme]);

  const setTheme = (themeName: ThemeName) => {
    setCurrentTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};