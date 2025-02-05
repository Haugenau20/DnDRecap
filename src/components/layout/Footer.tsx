// components/layout/Footer.tsx
import React from 'react';

/**
 * Footer component containing copyright and additional information.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} D&D Campaign Companion</p>
      </div>
    </footer>
  );
};

export default Footer;