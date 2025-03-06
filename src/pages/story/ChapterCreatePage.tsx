// pages/story/ChapterCreatePage.tsx
import React, { useEffect } from 'react';
import Typography from '../../components/core/Typography';
import ChapterForm from '../../components/features/story/ChapterForm';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { useStory } from '../../context/StoryContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';
import { useFirebase } from '../../context/FirebaseContext';
import { BookPlus } from 'lucide-react';
import clsx from 'clsx';

/**
 * Page for creating a new chapter
 */
const ChapterCreatePage: React.FC = () => {
  const { isLoading } = useStory();
  const { theme } = useTheme();
  const themePrefix = theme.name;
  const { navigateToPage } = useNavigation();
  const { user } = useFirebase();

  // Redirect if user is not signed in
  useEffect(() => {
    if (!isLoading && !user) {
      navigateToPage('/story');
    }
  }, [isLoading, user, navigateToPage]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Story', href: '/story' },
    { label: 'Session Chapters', href: '/story/chapters' },
    { label: 'Create Chapter' }
  ];

  if (isLoading) {
    return (
      <div className="p-4">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className={clsx("min-h-screen p-4", `${themePrefix}-content`)}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-2">
          <BookPlus className={clsx("w-6 h-6", `${themePrefix}-primary`)} />
          <Typography variant="h2" className={clsx(`${themePrefix}-typography-heading`)}>
            Create New Chapter
          </Typography>
        </div>
        
        {/* Chapter Form */}
        <ChapterForm mode="create" />
      </div>
    </div>
  );
};

export default ChapterCreatePage;