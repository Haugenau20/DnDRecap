// context/NavigationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Navigation state interface
 */
interface NavigationState {
  /** Current route path */
  currentPath: string;
  /** Previous route path for back navigation */
  previousPath: string | null;
  /** Reading progress tracking for story pages */
  readingProgress: {
    currentChapter: string;
    currentPage: number;
    lastPosition: {
      chapter: string;
      page: number;
    };
  };
  /** Breadcrumb trail */
  breadcrumbs: string[];
}

/**
 * Navigation context interface
 */
interface NavigationContextData {
  /** Current navigation state */
  state: NavigationState;
  /** Navigate to a specific page */
  navigateToPage: (path: string) => void;
  /** Go back to previous page */
  goBack: () => void;
  /** Update breadcrumb trail */
  updateBreadcrumbs: (newPath: string) => void;
  /** Update reading progress */
  updateReadingProgress: (chapter: string, page: number) => void;
  /** Return to last reading position */
  returnToLastPosition: () => void;
  /** Navigate to next page in chapter */
  nextPage: () => void;
  /** Navigate to previous page in chapter */
  previousPage: () => void;
  /** Jump to specific chapter */
  jumpToChapter: (chapterId: string) => void;
}

const NavigationContext = createContext<NavigationContextData | undefined>(undefined);

/**
 * Default navigation state
 */
const defaultState: NavigationState = {
  currentPath: '',
  previousPath: null,
  readingProgress: {
    currentChapter: '',
    currentPage: 1,
    lastPosition: {
      chapter: '',
      page: 1
    }
  },
  breadcrumbs: []
};

/**
 * Navigation provider component
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<NavigationState>({
    ...defaultState,
    currentPath: location.pathname,
    breadcrumbs: [location.pathname]
  });

  /**
   * Navigate to a specific page
   */
  const navigateToPage = useCallback((path: string) => {
    setState(prev => ({
      ...prev,
      currentPath: path,
      previousPath: prev.currentPath,
      breadcrumbs: [...prev.breadcrumbs, path]
    }));
    navigate(path);
  }, [navigate]);

  /**
   * Go back to previous page
   */
  const goBack = useCallback(() => {
    if (state.previousPath) {
      navigate(state.previousPath);
      setState(prev => ({
        ...prev,
        currentPath: prev.previousPath!,
        previousPath: prev.breadcrumbs[prev.breadcrumbs.length - 2] || null,
        breadcrumbs: prev.breadcrumbs.slice(0, -1)
      }));
    }
  }, [navigate, state.previousPath]);

  /**
   * Update breadcrumb trail
   */
  const updateBreadcrumbs = useCallback((newPath: string) => {
    setState(prev => {
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

  /**
   * Update reading progress
   */
  const updateReadingProgress = useCallback((chapter: string, page: number) => {
    setState(prev => ({
      ...prev,
      readingProgress: {
        currentChapter: chapter,
        currentPage: page,
        lastPosition: {
          chapter: prev.readingProgress.currentChapter,
          page: prev.readingProgress.currentPage
        }
      }
    }));
  }, []);

  /**
   * Return to last reading position
   */
  const returnToLastPosition = useCallback(() => {
    const { chapter, page } = state.readingProgress.lastPosition;
    if (chapter) {
      navigateToPage(`/story/chronicles/${chapter}`);
      setState(prev => ({
        ...prev,
        readingProgress: {
          ...prev.readingProgress,
          currentChapter: chapter,
          currentPage: page
        }
      }));
    }
  }, [state.readingProgress.lastPosition, navigateToPage]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      readingProgress: {
        ...prev.readingProgress,
        currentPage: prev.readingProgress.currentPage + 1,
        lastPosition: {
          chapter: prev.readingProgress.currentChapter,
          page: prev.readingProgress.currentPage
        }
      }
    }));
  }, []);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      readingProgress: {
        ...prev.readingProgress,
        currentPage: Math.max(1, prev.readingProgress.currentPage - 1),
        lastPosition: {
          chapter: prev.readingProgress.currentChapter,
          page: prev.readingProgress.currentPage
        }
      }
    }));
  }, []);

  /**
   * Jump to specific chapter
   */
  const jumpToChapter = useCallback((chapterId: string) => {
    navigateToPage(`/story/chronicles/${chapterId}`);
    setState(prev => ({
      ...prev,
      readingProgress: {
        currentChapter: chapterId,
        currentPage: 1,
        lastPosition: {
          chapter: prev.readingProgress.currentChapter,
          page: prev.readingProgress.currentPage
        }
      }
    }));
  }, [navigateToPage]);

  const value = {
    state,
    navigateToPage,
    goBack,
    updateBreadcrumbs,
    updateReadingProgress,
    returnToLastPosition,
    nextPage,
    previousPage,
    jumpToChapter
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Format breadcrumb label from path
 */
export const formatBreadcrumbLabel = (path: string): string => {
  if (path === '/') return 'Home';
  const segment = path.split('/').pop() || '';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

/**
 * Hook to access navigation context
 */
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};