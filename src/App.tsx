// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { SearchProvider } from './context/SearchContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Layout from './components/layout/Layout';

// Import pages
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import QuestsPage from './pages/QuestsPage';
import NPCsPage from './pages/NPCsPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NavigationProvider>
        <SearchProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/npcs" element={<NPCsPage />} />
            </Routes>
          </Layout>
        </SearchProvider>
      </NavigationProvider>
    </ErrorBoundary>
  );
};

export default App;