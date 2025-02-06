// pages/StoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookViewer from '../components/features/story/BookViewer';
import TableOfContents from '../components/features/story/TableOfContents';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import { Bookmark, Book } from 'lucide-react';

// Sample chapter data - In a real app, this would come from an API or data store
const sampleChapters = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: The Beginning',
    content: 'It was a dark and stormy night in the realm of Faerûn... The party had just gathered at the local tavern, each drawn by rumors of adventure and the promise of gold. Little did they know that their simple meeting would lead to an epic journey across the realms.',
    order: 1
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: The First Quest',
    content: 'The party gathered at the Yawning Portal Inn, their hearts heavy with anticipation. The mysterious stranger who had contacted them sat in a dark corner, a hood drawn over their features. As they approached, the figure looked up, revealing...',
    order: 2
  }
];

const StoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [currentChapter, setCurrentChapter] = useState(sampleChapters[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (chapterId) {
      const chapter = sampleChapters.find(c => c.id === chapterId);
      if (chapter) {
        setCurrentChapter(chapter);
        // Restore last reading position
        setCurrentPage(readingProgress[chapterId] || 1);
      }
    }
  }, [chapterId, readingProgress]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Save reading progress
    setReadingProgress(prev => ({
      ...prev,
      [currentChapter.id]: page
    }));
  };

  const handleChapterSelect = (chapter: typeof sampleChapters[0]) => {
    navigate(`/story/${chapter.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Chapter Selection */}
        <div className="mb-8 flex justify-between items-center">
          <Typography variant="h1">Campaign Story</Typography>
          <div className="flex items-center gap-4">
            <Bookmark className="text-blue-600" />
            <Typography color="secondary">
              Reading Chapter {currentChapter?.order} of {sampleChapters.length}
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
                {sampleChapters.map(chapter => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chapter.id === currentChapter?.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Typography variant="body-sm">
                      {chapter.title}
                    </Typography>
                    {readingProgress[chapter.id] && (
                      <div className="mt-2 h-1 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(readingProgress[chapter.id] / 5) * 100}%` }}
                        />
                      </div>
                    )}
                  </button>
                ))}
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