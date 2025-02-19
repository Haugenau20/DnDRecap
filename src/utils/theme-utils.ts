// src/utils/theme-utils.ts
import { ThemeName } from '../types/theme';

/**
 * Determines if the current theme is the D&D theme
 * @param themeName - Current theme name
 * @returns boolean indicating if D&D theme is active
 */
export const isDndTheme = (themeName: ThemeName): boolean => {
  return themeName === 'dnd';
};

/**
 * Generates theme-specific class names based on current theme
 * @param themeName - Current theme name
 * @param componentName - Component name for specific styling 
 * @returns String of class names to apply
 */
export const getThemeClasses = (
  themeName: ThemeName,
  componentName: 'card' | 'button' | 'input' | 'typography' | 'layout' | 'navigation'
): string => {
  if (themeName === 'dnd') {
    switch (componentName) {
      case 'card':
        return 'dnd-card';
      case 'button':
        return 'dnd-button';
      case 'input':
        return 'dnd-input';
      case 'typography':
        return 'dnd-typography';
      case 'layout':
        return 'dnd-theme';
      case 'navigation':
        return 'dnd-navigation';
      default:
        return '';
    }
  }
  
  // Add other theme-specific classes as needed
//   if (themeName === 'cyberpunk') {
    // Future cyberpunk theme styles
//   }
  
  return '';
};

/**
 * Combines component variant styles with theme-specific styles
 * @param themeName - Current theme name
 * @param baseStyles - Base component styles
 * @param themeStyles - Theme-specific styles to apply conditionally
 * @returns Combined class string
 */
export const combineThemeStyles = (
  themeName: ThemeName,
  baseStyles: string,
  themeStyles: Partial<Record<ThemeName, string>>
): string => {
  const themeSpecificStyles = themeStyles[themeName] || '';
  return `${baseStyles} ${themeSpecificStyles}`.trim();
};

/**
 * Applies D&D theme specific decorations to elements
 * @param element - Element type to decorate
 * @returns CSS class for the decoration
 */
export const getDndDecoration = (
  element: 'heading' | 'card' | 'divider' | 'section'
): string => {
  switch (element) {
    case 'heading':
      return 'dnd-heading';
    case 'card':
      return 'dnd-card';
    case 'divider':
      return 'dnd-divider';
    case 'section':
      return 'dnd-section';
    default:
      return '';
  }
};