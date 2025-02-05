// context/NavigationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationState {
  currentChapter: string;
  currentPage: number;
  lastPosition: {
    chapter: string;
    page: number;
  };
}

interface NavigationContextType {
  state: NavigationState;
  nextPage: () => void;
  previousPage: () => void;
  jumpToChapter: (chapter: string) => void;
  returnToLastPosition: () => void;
}

const defaultState: NavigationState = {
  currentChapter: '',
  currentPage: 1,
  lastPosition: {
    chapter: '',
    page: 1
  }
};

/**
 * Context for managing global navigation state
 */
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Provider component for navigation state and actions
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>(defaultState);

  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      lastPosition: {
        chapter: prev.currentChapter,
        page: prev.currentPage
      }
    }));
  }, []);

  const previousPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1),
      lastPosition: {
        chapter: prev.currentChapter,
        page: prev.currentPage
      }
    }));
  }, []);

  const jumpToChapter = useCallback((chapter: string) => {
    setState(prev => ({
      ...prev,
      currentChapter: chapter,
      currentPage: 1,
      lastPosition: {
        chapter: prev.currentChapter,
        page: prev.currentPage
      }
    }));
  }, []);

  const returnToLastPosition = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentChapter: prev.lastPosition.chapter,
      currentPage: prev.lastPosition.page
    }));
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        state,
        nextPage,
        previousPage,
        jumpToChapter,
        returnToLastPosition
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Custom hook for accessing navigation context
 * @throws {Error} If used outside of NavigationProvider
 */
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};