// utils/navigation.ts
/**
 * Utility functions for navigation
 */

/**
 * Formats a path for navigation
 */
export const formatPath = (path: string): string => {
    return path.startsWith('/') ? path : `/${path}`;
  };
  
  /**
   * Checks if a path is active
   */
  export const isActivePath = (currentPath: string, checkPath: string): boolean => {
    return currentPath === formatPath(checkPath);
  };