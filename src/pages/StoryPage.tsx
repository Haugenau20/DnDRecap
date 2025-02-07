// pages/StoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookViewer from '../components/features/story/BookViewer';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import { useStory } from '../context/StoryContext';
import { Bookmark, Book } from 'lucide-react';

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

  // Set initial chapter based on URL parameter or last read chapter
  useEffect(() => {
    if (chapterId) {
      const chapter = getChapterById(chapterId);
      if (chapter) {
        setCurrentChapter(chapter);
        updateCurrentChapter(chapter.id);
      }
    } else if (storyProgress.currentChapter) {
      // If no chapter specified, load the last read chapter
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
        {/* Chapter Selection */}
        <div className="mb-8 flex justify-between items-center">
          <Typography variant="h1">Campaign Story</Typography>
          <div className="flex items-center gap-4">
            <Bookmark className="text-blue-600" />
            <Typography color="secondary">
              Reading Chapter {currentChapter?.order} of {chapters.length}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <Card className="lg:col-span-1 h-fit">
            <Card.Header
              title="Chapters"
            />
            <Card.Content>
              <nav className="space-y-2">
                {chapters.map(chapter => {
                  const progress = storyProgress.chapterProgress[chapter.id];
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        chapter.id === currentChapter?.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Typography variant="body-sm">
                          {chapter.title}
                        </Typography>
                        {progress?.isComplete && (
                          <Book className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {progress && (
                        <div className="mt-2 h-1 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.lastPosition / 5) * 100}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </Card.Content>
          </Card>

          {/* Book Viewer */}
          <div className="lg:col-span-3">
            <BookViewer
              content={currentChapter?.content || ''}
              title={currentChapter?.title || ''}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;