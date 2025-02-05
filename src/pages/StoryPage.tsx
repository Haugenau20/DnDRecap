// pages/StoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StoryViewer from '../components/features/story/StoryViewer';
import { Chapter } from '../types/story';

// Sample chapter data - In a real app, this would come from an API or data store
const sampleChapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: The Beginning',
    content: 'It was a dark and stormy night in the realm of Faerûn...',
    order: 1
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: The First Quest',
    content: 'The party gathered at the Yawning Portal Inn...',
    order: 2
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Shadows in the Dark',
    content: 'Deep within the underdark, danger lurked...',
    order: 3
  }
];

/**
 * StoryPage component handles the story viewing experience
 * including chapter management and navigation
 */
const StoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>();

  // Simulate loading chapters from an API
  useEffect(() => {
    const loadChapters = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChapters(sampleChapters);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading chapters:', error);
        setIsLoading(false);
      }
    };

    loadChapters();
  }, []);

  // Handle chapter selection
  useEffect(() => {
    if (chapters.length > 0) {
      if (chapterId) {
        const chapter = chapters.find(c => c.id === chapterId);
        setCurrentChapter(chapter);
      } else {
        // If no chapter is selected, use the first one
        setCurrentChapter(chapters[0]);
        navigate(`/story/${chapters[0].id}`);
      }
    }
  }, [chapters, chapterId, navigate]);

  // Handle chapter selection
  const handleChapterSelect = (selectedChapterId: string) => {
    navigate(`/story/${selectedChapterId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StoryViewer
        chapters={chapters}
        currentChapter={currentChapter}
        isLoading={isLoading}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  );
};

export default StoryPage;