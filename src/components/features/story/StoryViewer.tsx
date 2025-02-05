// features/story/StoryViewer.tsx
import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { Chapter } from '../../../types/story';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import ChapterNavigation from './ChapterNavigation';
import { BookOpen } from 'lucide-react';

interface StoryViewerProps {
    /** Array of all chapters */
    chapters: Chapter[];
    /** Current chapter data */
    currentChapter?: Chapter;
    /** Whether the content is loading */
    isLoading?: boolean;
    /** Function to handle chapter navigation */
    onChapterSelect: (chapterId: string) => void;
  }
  
  /**
   * StoryViewer component for displaying chapter content in a book-like format
   * Integrated with ChapterNavigation for seamless story navigation
   */
  const StoryViewer: React.FC<StoryViewerProps> = ({
    chapters,
    currentChapter,
    isLoading = false,
    onChapterSelect,
  }) => {
    const { state: navState } = useNavigation();
    const [progress, setProgress] = useState(0);
  
    // Calculate reading progress
    useEffect(() => {
      if (currentChapter) {
        const currentChapterNumber = currentChapter.order;
        setProgress((currentChapterNumber / chapters.length) * 100);
      }
    }, [currentChapter, chapters.length]);
  
    if (isLoading) {
      return (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-16 bg-gray-100 rounded animate-pulse" />
          <Card className="animate-pulse">
            <Card.Content className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </Card.Content>
          </Card>
        </div>
      );
    }
  
    return (
      <div className="relative min-h-screen">
        {/* Navigation Component */}
        <ChapterNavigation
          chapters={chapters}
          currentChapterId={currentChapter?.id}
          onChapterSelect={onChapterSelect}
          progress={progress}
          className="sticky top-0 z-10 bg-white"
        />
  
        {/* Main Content */}
        <div className="max-w-4xl mx-auto mt-6">
          {currentChapter ? (
            <Card>
              <Card.Header
                title={currentChapter.title}
              />
              <Card.Content>
                <Typography className="prose max-w-none">
                  {currentChapter.content}
                </Typography>
              </Card.Content>
            </Card>
          ) : (
            <Card className="text-center p-8">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <Typography variant="h3" className="mb-2">
                No Chapter Selected
              </Typography>
              <Typography color="secondary" className="mb-6">
                Select a chapter from the navigation menu to begin reading
              </Typography>
            </Card>
          )}
        </div>
      </div>
    );
  };
  
  export default StoryViewer;