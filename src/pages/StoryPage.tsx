// pages/StoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StoryViewer from '../components/features/story/StoryViewer';
import { Chapter } from '../types/story';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import { BookOpen } from 'lucide-react';

// Sample chapter data - In a real app, this would come from an API or data store
const sampleChapters: Chapter[] = [
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
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Shadows in the Dark',
    content: 'Deep within the underdark, danger lurked around every corner. The sound of dripping water echoed through the caverns, and somewhere in the distance, something ancient stirred from its slumber...',
    order: 3
  }
];

const StoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Load chapters
  useEffect(() => {
    const loadChapters = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChapters(sampleChapters);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading chapters:', error);
        setError('Failed to load chapters');
        setIsLoading(false);
      }
    };

    loadChapters();
  }, []);

  // Handle chapter selection based on URL param
  useEffect(() => {
    if (!isLoading && chapters.length > 0) {
      if (chapterId) {
        const chapter = chapters.find(c => c.id === chapterId);
        if (chapter) {
          setCurrentChapter(chapter);
          setError(null);
        } else {
          setError('Chapter not found');
          navigate('/story');
        }
      } else {
        // If on /story route with no chapter specified, show chapter list
        setCurrentChapter(undefined);
      }
    }
  }, [chapters, chapterId, navigate, isLoading]);

  const handleChapterSelect = (selectedChapterId: string) => {
    const chapter = chapters.find(c => c.id === selectedChapterId);
    if (chapter) {
      navigate(`/story/${selectedChapterId}`);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <Card.Content className="text-center p-8">
            <Typography color="error" className="mb-4">{error}</Typography>
            <Typography color="secondary">
              Please select a valid chapter from the list
            </Typography>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {!chapterId ? (
        // Chapter selection view
        <div className="max-w-4xl mx-auto">
          <Typography variant="h1" className="mb-6">Campaign Story</Typography>
          <div className="grid gap-4">
            {chapters.map(chapter => (
              <Card 
                key={chapter.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleChapterSelect(chapter.id)}
              >
                <Card.Content className="p-4">
                  <Typography variant="h3" className="mb-2">
                    {chapter.title}
                  </Typography>
                  <Typography color="secondary" className="line-clamp-2">
                    {chapter.content}
                  </Typography>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Chapter reading view
        <StoryViewer
          chapters={chapters}
          currentChapter={currentChapter}
          isLoading={isLoading}
          onChapterSelect={handleChapterSelect}
        />
      )}
    </div>
  );
};

export default StoryPage;