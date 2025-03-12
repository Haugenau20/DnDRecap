// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationProvider } from './context/NavigationContext';
import { SearchProvider } from './context/SearchContext';
import { NPCProvider } from './context/NPCContext';
import { StoryProvider } from './context/StoryContext';
import { LocationProvider } from './context/LocationContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { RumorProvider } from './context/RumorContext';
import { QuestProvider } from './context/QuestContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import SessionManager from './components/features/auth/SessionManager';
import RouterWrapper from './components/routing/RouterWrapper';

/**
 * Main application component that sets up the provider hierarchy
 * All providers are organized in a clear, nested structure
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FirebaseProvider>
          <SessionManager>
            <BrowserRouter basename="/DnDRecap">
              <NavigationProvider>
                <NPCProvider>
                  <LocationProvider>
                    <StoryProvider>
                      <RumorProvider>
                        <QuestProvider>
                          <SearchProvider>
                            <RouterWrapper />
                          </SearchProvider>
                        </QuestProvider>
                      </RumorProvider>
                    </StoryProvider>
                  </LocationProvider>
                </NPCProvider>
              </NavigationProvider>
            </BrowserRouter>
          </SessionManager>
        </FirebaseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;