// src/types/theme.ts

/**
 * Available theme names
 */
export type ThemeName = 'default' | 'dnd';

/**
 * Theme colors configuration
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
    accent: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  card: {
    background: string;
    border: string;
  };
  button: {
    primary: {
      background: string;
      text: string;
      hover: string;
    };
    secondary: {
      background: string;
      text: string;
      hover: string;
    };
  };
}

/**
 * Font configuration for a theme
 */
export interface ThemeFonts {
  primary: string;
  secondary: string;
  heading: string;
}

/**
 * Border styles for a theme
 */
export interface ThemeBorders {
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  width: {
    sm: string;
    md: string;
    lg: string;
  };
}

/**
 * Decorative styles for a theme
 */
export interface DecorativeElements {
  cardBorder: string;
  headingDecoration: string;
}

/**
 * Complete theme configuration
 */
export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  fonts: ThemeFonts;
  borders: ThemeBorders;
  decorative?: DecorativeElements;
}

/**
 * Theme context state
 */
export interface ThemeContextState {
  theme: Theme;
  setTheme: (theme: ThemeName) => void;
}