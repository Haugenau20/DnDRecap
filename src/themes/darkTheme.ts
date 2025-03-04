// src/themes/darkTheme.ts
import { Theme } from '../types/theme';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#8AB4F8', // Soft blue for primary elements
    secondary: '#BB86FC', // Muted purple for secondary elements
    accent: '#F28B82', // Soft red for accents
    background: {
      primary: '#1E1E2E', // Deep grayish-blue (not pure black)
      secondary: '#2A2A3C', // Slightly lighter grayish-blue
      accent: '#3B3B52', // Complementary shade for contrast
    },
    text: {
      primary: '#E0E0E0', // Soft off-white for primary text
      secondary: '#B0B0B0', // Muted gray for secondary text
      accent: '#F28B82', // Accent color for important highlights
    },
    card: {
      background: '#252538', // Dark but not black for cards
      border: '#3B3B52', // Subtle border for definition
    },
    button: {
      primary: {
        background: '#8AB4F8',
        text: '#1E1E2E',
        hover: '#729DE3',
      },
      secondary: {
        background: '#BB86FC',
        text: '#1E1E2E',
        hover: '#9E6EDC',
      },
      link: {
        background: 'transparent',
        text: '#8AB4F8',
        hover: '#A0C4FF',
      },
      outline: {
        background: 'transparent',
        text: '#E0E0E0',
        hover: '#3B3B52',
      },
      ghost: {
        background: 'transparent',
        text: '#B0B0B0',
        hover: '#8AB4F8',
      },
    },
    // New UI-specific colors to replace hardcoded values
    ui: {
      heading: '#FFFFFF', // White for headings
      inputBackground: '#1A1A1A', // Slightly lighter than main bg
      inputPlaceholder: '#777777', // Medium gray for placeholders
      statusActive: '#888888', // Soft gray for active status
      statusCompleted: '#666666', // Medium gray for completed status
      statusFailed: '#AAAAAA', // Light gray for failed status
      statusText: '#121212', // Near black for status text on light backgrounds
      headerBackground: '#222222', // Slightly lighter than main bg for headers
      footerBackground: '#222222', // Match header for consistency
      hoverLight: 'rgba(255, 255, 255, 0.05)', // Subtle hover effect
      hoverMedium: 'rgba(255, 255, 255, 0.1)', // Slightly stronger hover effect
      iconBackground: '#3F4A5D', // Brighter background for icons
      iconBorder: '#323A47', // Border for icons
    }
  },
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    secondary: 'system-ui, sans-serif',
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
};