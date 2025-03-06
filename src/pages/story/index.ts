// pages/story/index.ts
import StorySelectionPage from './StorySelectionPage';
import StoryPage from './StoryPage';
import SagaPage from './SagaPage';
import ChaptersPage from './ChaptersPage';
import ChapterCreatePage from './ChapterCreatePage';
import ChapterEditPage from './ChapterEditPage';

// Export all story-related pages
export {
  StorySelectionPage as default, // Default export is the selection page
  StorySelectionPage,
  StoryPage,
  SagaPage,
  ChaptersPage,
  ChapterCreatePage,
  ChapterEditPage
};