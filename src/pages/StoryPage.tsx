import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookViewer from '../components/features/story/BookViewer';
import Typography from '../components/core/Typography';
import Breadcrumb from '../components/layout/Breadcrumb';
import SlidingChapters from '../components/features/story/SlidingChapters';
import { useStory } from '../context/StoryContext';
import { Bookmark, Menu } from 'lucide-react';
import Button from '../components/core/Button';

const StoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const { 
    chapters, 
    storyProgress, 
    isLoading,
    getChapterById, 
    updateChapterProgress, 
    updateCurrentChapter 
  } = useStory();
  
  const [currentChapter, setCurrentChapter] = useState(
    chapterId ? getChapterById(chapterId) : undefined
  );
  const [isChaptersOpen, setChaptersOpen] = useState(false);

  // Calculate next and previous chapters
  const { nextChapter, previousChapter } = useMemo(() => {
    if (!currentChapter) return { nextChapter: undefined, previousChapter: undefined };
    
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    return {
      nextChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined,
      previousChapter: currentIndex > 0 ? chapters[currentIndex - 1] : undefined
    };
  }, [currentChapter, chapters]);

  // Breadcrumb items
  const breadcrumbItems = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'Story', href: '/story' },
    { label: currentChapter ? `${currentChapter.order}. ${currentChapter.title}` : 'Loading...' }
  ], [currentChapter]);

  // Set initial chapter based on URL parameter or last read chapter
  useEffect(() => {
    if (chapterId) {
      const chapter = getChapterById(chapterId);
      if (chapter) {
        setCurrentChapter(chapter);
        updateCurrentChapter(chapter.id);
      }
    } else if (storyProgress.currentChapter) {
      const chapter = getChapterById(storyProgress.currentChapter);
      if (chapter) {
        navigate(`/story/${chapter.id}`);
      }
    }
  }, [chapterId, getChapterById, storyProgress.currentChapter, navigate, updateCurrentChapter]);

  const handlePageChange = (page: number) => {
    if (currentChapter) {
      updateChapterProgress(currentChapter.id, {
        lastPosition: page,
        lastRead: new Date(),
        isComplete: false
      });
    }
  };

  const handleChapterSelect = (chapterId: string) => {
    navigate(`/story/${chapterId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Typography>Loading story...</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Sliding Chapters Navigation */}
        <SlidingChapters
          chapters={chapters}
          currentChapterId={currentChapter?.id}
          onChapterSelect={handleChapterSelect}
          isOpen={isChaptersOpen}
          onClose={() => setChaptersOpen(false)}
        />

        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChaptersOpen(true)}
              startIcon={<Menu />}
              className="mr-2"
            >
              Chapters
            </Button>
            <div className="flex items-center gap-2">
              <Bookmark className="text-blue-600" />
              <Typography color="secondary">
                Reading Chapter {currentChapter?.order || 0} of {chapters.length}
              </Typography>
            </div>
          </div>
        </div>

        {/* Book Viewer */}
        <div className="max-w-4xl mx-auto">
          <BookViewer
            content={currentChapter?.content || ''}
            title={currentChapter ? `${currentChapter.order}. ${currentChapter.title}` : ''}
            onPageChange={handlePageChange}
            onNextChapter={() => nextChapter && handleChapterSelect(nextChapter.id)}
            onPreviousChapter={() => previousChapter && handleChapterSelect(previousChapter.id)}
            hasNextChapter={!!nextChapter}
            hasPreviousChapter={!!previousChapter}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryPage;