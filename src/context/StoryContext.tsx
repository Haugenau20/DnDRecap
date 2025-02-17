// src/context/StoryContext.tsx
import React, { createContext, useContext, useCallback } from 'react';
import { Chapter, ChapterProgress, StoryProgress } from '../types/story';
import { useChapterData } from '../hooks/useChapterData';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface StoryContextState {
  chapters: Chapter[];
  storyProgress: StoryProgress;
  isLoading: boolean;
  error: string | null;
}

interface StoryContextValue extends StoryContextState {
  getChapterById: (id: string) => Chapter | undefined;
  updateChapterProgress: (chapterId: string, progress: Partial<ChapterProgress>) => void;
  updateCurrentChapter: (chapterId: string) => void;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our new custom hook for chapters
  const { chapters, loading: chaptersLoading, error: chaptersError, refreshChapters } = useChapterData();
  
  // Firebase hook for updating progress
  const { updateData: updateProgress } = useFirebaseData<StoryProgress>({
    collection: 'story-progress'
  });

  // Initialize story progress
  const defaultProgress: StoryProgress = {
    currentChapter: '',
    lastRead: new Date(),
    chapterProgress: {}
  };

  // Get chapter by ID
  const getChapterById = useCallback((id: string) => {
    return chapters.find(chapter => chapter.id === id);
  }, [chapters]);

  // Update chapter progress
  const updateChapterProgress = useCallback(async (chapterId: string, progress: Partial<ChapterProgress>) => {
    try {
      const updatedProgress = {
        ...defaultProgress,
        chapterProgress: {
          ...defaultProgress.chapterProgress,
          [chapterId]: {
            chapterId,
            lastPosition: progress.lastPosition || 0,
            isComplete: progress.isComplete || false,
            lastRead: new Date()
          }
        }
      };
      
      await updateProgress('current-progress', updatedProgress);
      refreshChapters(); // Refresh to get updated data
    } catch (error) {
      console.error('Failed to update chapter progress:', error);
    }
  }, [updateProgress, refreshChapters]);

  // Update current chapter
  const updateCurrentChapter = useCallback(async (chapterId: string) => {
    try {
      const updatedProgress = {
        ...defaultProgress,
        currentChapter: chapterId,
        lastRead: new Date()
      };
      
      await updateProgress('current-progress', updatedProgress);
    } catch (error) {
      console.error('Failed to update current chapter:', error);
    }
  }, [updateProgress]);

  const value: StoryContextValue = {
    chapters,
    storyProgress: defaultProgress,
    isLoading: chaptersLoading,
    error: chaptersError,
    getChapterById,
    updateChapterProgress,
    updateCurrentChapter,
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};