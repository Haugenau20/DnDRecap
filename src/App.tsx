// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { SearchProvider } from './context/SearchContext';
import { NPCProvider } from './context/NPCContext';
import { StoryProvider } from './context/StoryContext';
import { LocationProvider } from './context/LocationContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Layout from './components/layout/Layout';

// Import pages
import HomePage from './pages/HomePage';
import StoryPage from './pages/story/StoryPage';
import QuestsPage from './pages/QuestsPage';
import NPCsPage from './pages/NPCsPage';
import LocationsPage from './pages/LocationsPage';
import StorySelection from './pages/story/index';
import SagaPage from './pages/story/SagaPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NavigationProvider>
        <SearchProvider>
          <NPCProvider>
            <LocationProvider>
              <StoryProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/story" element={<StorySelection />} />
                  <Route path="/story/chronicles" element={<StoryPage />} />
                  <Route path="/story/chronicles/:chapterId" element={<StoryPage />} />
                  <Route path="/story/saga" element={<SagaPage />} />
                  <Route path="/quests" element={<QuestsPage />} />
                  <Route path="/npcs" element={<NPCsPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                </Routes>
              </Layout>
              </StoryProvider>
            </LocationProvider>
          </NPCProvider>
        </SearchProvider>
      </NavigationProvider>
    </ErrorBoundary>
  );
};

export default App;