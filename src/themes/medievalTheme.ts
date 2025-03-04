// src/themes/medievalTheme.ts
import { Theme } from '../types/theme';

export const medievalTheme: Theme = {
  name: 'medieval',
  colors: {
    // Rich, parchment-like colors with medieval feel
    primary: '#8B0000',      // Deep red for primary actions
    secondary: '#483C32',    // Warm brown for secondary elements
    accent: '#DAA520',       // Golden accent for highlights
    background: {
      primary: '#FDF5E6',    // Old parchment color
      secondary: '#F5E6D3',   // Slightly darker parchment
      accent: '#FFE4B5',     // Muted gold for accent backgrounds
    },
    text: {
      primary: '#2C1810',    // Deep brown for primary text
      secondary: '#483C32',   // Warm brown for secondary text
      accent: '#8B0000',     // Deep red for accent text
    },
    card: {
      background: '#FFF8DC',  // Light parchment for cards
      border: '#8B4513',     // Saddle brown for borders
    },
    button: {
      primary: {
        background: '#E8D0AA',
        text: '#2C1810',
        hover: '#DABB8D',
      },
      secondary: {
        background: '#483C32',
        text: '#FDF5E6',
        hover: '#32281E'
      },
      link: {
        background: 'transparent',
        text: '#8B0000',
        hover: '#5D0000'
      },
      outline: {
        background: 'transparent',
        text: '#2C1810',
        hover: '#F5E6D3'
      },
      ghost: {
        background: 'transparent',
        text: '#2C1810',
        hover: '#F5E6D3'
      },
    },
    // Add UI-specific colors for the D&D theme
    ui: {
      heading: '#2C1810',     // Deep brown for headings
      inputBackground: '#FFF8DC', // Light parchment for inputs
      inputPlaceholder: '#A89A7E', // Muted brown for placeholders
      statusActive: '#DAA520', // Gold for active status
      statusCompleted: '#006400', // Deep green for completed status
      statusFailed: '#8B0000', // Deep red for failed status
      statusText: '#FDF5E6', // Light parchment for status text
      headerBackground: '#F5E6D3', // Slightly darker parchment for header
      footerBackground: '#F5E6D3', // Match header for consistency
      hoverLight: 'rgba(139, 69, 19, 0.05)', // Light brown hover
      hoverMedium: 'rgba(139, 69, 19, 0.1)', // Medium brown hover
      iconBackground: '#F5E6D3', // Slightly darker parchment for icons
      iconBorder: '#8B4513', // Saddle brown for icon borders
    }
  },
  fonts: {
    // Using more readable fonts while maintaining medieval feel
    primary: 'Crimson Text, serif',        // More readable serif font
    secondary: 'Gentium Book Basic, serif', // Alternative readable serif
    heading: 'MedievalSharp, cursive',     // Decorative font for headings only
  },
  borders: {
    radius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
    },
    width: {
      sm: '2px',
      md: '3px',
      lg: '4px',
    },
  },
};