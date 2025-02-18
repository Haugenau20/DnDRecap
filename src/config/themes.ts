// src/config/themes.ts
import { Theme } from '../types/theme';

export const themes: Record<Theme['name'], Theme> = {
  default: {
    name: 'default',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981',
      background: {
        primary: '#F9FAFB',
        secondary: '#F3F4F6',
        accent: '#EEF2FF',
      },
      text: {
        primary: '#111827',
        secondary: '#4B5563',
        accent: '#3B82F6',
      },
      card: {
        background: '#FFFFFF',
        border: '#E5E7EB',
      },
      button: {
        primary: {
          background: '#3B82F6',
          text: '#FFFFFF',
          hover: '#2563EB',
        },
        secondary: {
          background: '#6B7280',
          text: '#FFFFFF',
          hover: '#4B5563',
        },
      },
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'system-ui, sans-serif',
      heading: 'Inter, sans-serif',
    },
    borders: {
      radius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      width: {
        sm: '1px',
        md: '2px',
        lg: '4px',
      },
    },
  },
  dnd: {
    name: 'dnd',
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
          background: '#8B0000',
          text: '#FDF5E6',
          hover: '#690000',
        },
        secondary: {
          background: '#483C32',
          text: '#FDF5E6',
          hover: '#32281E',
        },
      },
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
    // New property for theme-specific decorative elements
    decorative: {
      cardBorder: `
        border: 2px solid #8B4513;
        background-image: 
          url('/decorative/corner-dragon.svg'),
          url('/decorative/corner-dragon.svg'),
          url('/decorative/corner-dragon.svg'),
          url('/decorative/corner-dragon.svg');
        background-position: 
          top left,
          top right,
          bottom left,
          bottom right;
        background-repeat: no-repeat;
        background-size: 2rem 2rem;
        padding: 1rem;
      `,
      headingDecoration: `
        position: relative;
        &::before, &::after {
          content: '';
          position: absolute;
          height: 2px;
          background: #8B4513;
          background-image: linear-gradient(
            90deg,
            #8B4513 0%,
            #DAA520 50%,
            #8B4513 100%
          );
        }
      `,
    },
  },
};