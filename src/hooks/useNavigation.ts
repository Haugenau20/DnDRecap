// hooks/useNavigation.ts
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation as useNavigationContext } from '../context/NavigationContext';
import {
  formatPath,
  isActivePath,
  isParentPath,
  getQueryParams,
  buildUrl,
  getPathSegments,
  getParentPath
} from '../utils/navigation';

/**
 * Enhanced navigation hook that combines context navigation with utility functions
 */
export const useNavigation = () => {
  const navigation = useNavigationContext();
  const location = useLocation();

  /**
   * Navigate with query parameters
   */
  const navigateWithParams = useCallback((
    path: string,
    params: Record<string, string>
  ) => {
    const url = buildUrl(path, params);
    navigation.navigateToPage(url);
  }, [navigation]);

  /**
   * Get current query parameters
   */
  const getCurrentParams = useCallback(() => {
    return getQueryParams(location.search);
  }, [location.search]);

  /**
   * Update query parameters without navigation
   */
  const updateParams = useCallback((
    params: Record<string, string>
  ) => {
    const currentParams = getCurrentParams();
    const url = buildUrl(location.pathname, { ...currentParams, ...params });
    navigation.navigateToPage(url);
  }, [location.pathname, getCurrentParams, navigation]);

  return {
    // Original navigation context
    ...navigation,
    
    // Enhanced navigation utilities
    navigateWithParams,
    getCurrentParams,
    updateParams,
    
    // Path utilities
    formatPath,
    isActivePath: (path: string) => isActivePath(location.pathname, path),
    isParentPath: (path: string) => isParentPath(location.pathname, path),
    getPathSegments: () => getPathSegments(location.pathname),
    getParentPath: () => getParentPath(location.pathname),
    
    // Current location info
    currentPath: location.pathname,
    currentSearch: location.search,
    currentHash: location.hash
  };
};

export default useNavigation;