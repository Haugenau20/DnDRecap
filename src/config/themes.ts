// src/config/themes.ts
import { Theme } from '../types/theme';

export const themes: Record<Theme['name'], Theme> = {
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
  },
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
        link: {
          background: 'transparent',
          text: '#3B82F6',
          hover: '#2563EB',
        },
        outline: {
          background: 'transparent',
          text: '#4B5563',
          hover: '#F9FAFB',
        },
        ghost: {
          background: 'transparent',
          text: '#4B5563',
          hover: '#F3F4F6',
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
};