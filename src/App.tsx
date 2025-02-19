// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { SearchProvider } from './context/SearchContext';
import { NPCProvider } from './context/NPCContext';
import { StoryProvider } from './context/StoryContext';
import { LocationProvider } from './context/LocationContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Layout from './components/layout/Layout';

// Import pages
import HomePage from './pages/HomePage';
import StorySelection from './pages/story';
import StoryPage from './pages/story/StoryPage';
import SagaPage from './pages/story/SagaPage';
import { QuestsPage, QuestCreatePage, QuestEditPage } from './pages/quests';
import { NPCsPage, NPCsCreatePage, NPCsEditPage } from './pages/npcs';
import { LocationsPage, LocationCreatePage, LocationEditPage } from './pages/locations';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FirebaseProvider>
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
                        <Route path="/quests/create" element={<QuestCreatePage />} />
                        <Route path="/quests/edit/:questId" element={<QuestEditPage />} />
                        <Route path="/npcs" element={<NPCsPage />} />
                        <Route path="/npcs/create" element={<NPCsCreatePage />} />
                        <Route path="/npcs/edit/:npcId" element={<NPCsEditPage />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route path="/locations/create" element={<LocationCreatePage />} />
                        <Route path="/locations/edit/:locationId" element={<LocationEditPage />} />
                      </Routes>
                    </Layout>
                  </StoryProvider>
                </LocationProvider>
              </NPCProvider>
            </SearchProvider>
          </NavigationProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;