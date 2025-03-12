// src/components/routing/RouterWrapper.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigation } from '../../context/NavigationContext';
import Layout from '../layout/Layout';
import SessionTimeoutWarning from '../features/auth/SessionTimeoutWarning';
import PrivacyNotice from '../features/auth/PrivacyNotice';

// Import pages
import HomePage from '../../pages/HomePage';
import { 
  StorySelectionPage, 
  StoryPage, 
  SagaPage,
  SagaEditPage, 
  ChaptersPage,
  ChapterCreatePage, 
  ChapterEditPage 
} from '../../pages/story';
import { QuestsPage, QuestCreatePage, QuestEditPage } from '../../pages/quests';
import { NPCsPage, NPCsCreatePage, NPCsEditPage } from '../../pages/npcs';
import { LocationsPage, LocationCreatePage, LocationEditPage } from '../../pages/locations';
import { RumorsPage, RumorCreatePage, RumorEditPage } from '../../pages/rumors';
import PrivacyPolicyPage from '../../pages/PrivacyPolicyPage';
import ContactPage from '../../pages/ContactPage';

/**
 * Wrapper component that handles routing and redirects
 * Processes URL parameters and renders the appropriate routes
 */
const RouterWrapper: React.FC = () => {
  const { navigateToPage, createPath, getCurrentQueryParams } = useNavigation();

  useEffect(() => {
    // Get the route from URL parameters
    const { route } = getCurrentQueryParams();
    
    if (route) {
      // Remove the query parameter and navigate to the actual route
      const newUrl = window.location.pathname.replace(/\/$/, '');
      window.history.replaceState(null, '', newUrl);
      navigateToPage(createPath('/' + route))
    }
  }, [navigateToPage, createPath, getCurrentQueryParams]);

  return (
    <Layout>
      <SessionTimeoutWarning />
      <PrivacyNotice />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story" element={<StorySelectionPage />} />
        <Route path="/story/chapters" element={<ChaptersPage />} />
        <Route path="/story/chapters/:chapterId" element={<StoryPage />} />
        <Route path="/story/saga" element={<SagaPage />} />
        <Route path="/story/saga/edit" element={<SagaEditPage />} />
        <Route path="/story/chapters/create" element={<ChapterCreatePage />} />
        <Route path="/story/chapters/edit/:chapterId" element={<ChapterEditPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/quests/create" element={<QuestCreatePage />} />
        <Route path="/quests/edit/:questId" element={<QuestEditPage />} />
        <Route path="/npcs" element={<NPCsPage />} />
        <Route path="/npcs/create" element={<NPCsCreatePage />} />
        <Route path="/npcs/edit/:npcId" element={<NPCsEditPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/create" element={<LocationCreatePage />} />
        <Route path="/locations/edit/:locationId" element={<LocationEditPage />} />
        <Route path="/rumors" element={<RumorsPage />} />
        <Route path="/rumors/create" element={<RumorCreatePage />} />
        <Route path="/rumors/edit/:rumorId" element={<RumorEditPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
};

export default RouterWrapper;