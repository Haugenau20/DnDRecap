// context/NavigationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  breadcrumbs: string[];
}

interface NavigationContextData {
  state: NavigationState;
  navigateToPage: (path: string) => void;
  goBack: () => void;
  updateBreadcrumbs: (newPath: string) => void;
}

const NavigationContext = createContext<NavigationContextData | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [state, setState] = useState<NavigationState>({
    currentPath: location.pathname,
    previousPath: null,
    breadcrumbs: [location.pathname]
  });

  const navigateToPage = useCallback((path: string) => {
    setState(prev => ({
      currentPath: path,
      previousPath: prev.currentPath,
      breadcrumbs: [...prev.breadcrumbs, path]
    }));
    navigate(path);
  }, [navigate]);

  const goBack = useCallback(() => {
    if (state.previousPath) {
      navigate(state.previousPath);
      setState(prev => ({
        currentPath: prev.previousPath!,
        previousPath: prev.breadcrumbs[prev.breadcrumbs.length - 2] || null,
        breadcrumbs: prev.breadcrumbs.slice(0, -1)
      }));
    }
  }, [navigate, state.previousPath]);

  const updateBreadcrumbs = useCallback((newPath: string) => {
    setState(prev => {
      // Create a sensible breadcrumb trail
      const pathSegments = newPath.split('/').filter(Boolean);
      const newBreadcrumbs = ['/', ...pathSegments.map((_, index) => 
        '/' + pathSegments.slice(0, index + 1).join('/')
      )];

      return {
        ...prev,
        breadcrumbs: newBreadcrumbs
      };
    });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        state,
        navigateToPage,
        goBack,
        updateBreadcrumbs
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Helper function to format breadcrumb labels
export const formatBreadcrumbLabel = (path: string): string => {
  if (path === '/') return 'Home';
  const segment = path.split('/').pop() || '';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};