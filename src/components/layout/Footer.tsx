// components/layout/Footer.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const themePrefix = theme.name;
  
  return (
    <footer className={clsx(
      'p-4',
      `${themePrefix}-footer`
    )}>
      <div className="container mx-auto text-center">
        <p className={clsx(`${themePrefix}-typography`)}>
          &copy; {new Date().getFullYear()} D&D Campaign Companion
        </p>
      </div>
    </footer>
  );
};

export default Footer;