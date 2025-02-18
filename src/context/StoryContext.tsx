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
  /** Get a specific chapter by ID */
  getChapterById: (id: string) => Chapter | undefined;
  /** Update progress for a specific chapter */
  updateChapterProgress: (chapterId: string, progress: Partial<ChapterProgress>) => void;
  /** Update the current chapter */
  updateCurrentChapter: (chapterId: string) => void;
  /** Get next chapter if available */
  getNextChapter: (currentChapterId: string) => Chapter | undefined;
  /** Get previous chapter if available */
  getPreviousChapter: (currentChapterId: string) => Chapter | undefined;
  /** Mark a chapter as complete */
  markChapterComplete: (chapterId: string) => void;
  /** Get reading progress percentage */
  getReadingProgress: () => number;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

/**
 * Default story progress state
 */
const defaultProgress: StoryProgress = {
  currentChapter: '',
  lastRead: new Date(),
  chapterProgress: {}
};

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use existing hooks for data
  const { chapters, loading: chaptersLoading, error: chaptersError, refreshChapters } = useChapterData();
  const { updateData } = useFirebaseData<StoryProgress>({ collection: 'story-progress' });

  // Get chapter by ID
  const getChapterById = useCallback((id: string) => {
    return chapters.find(chapter => chapter.id === id);
  }, [chapters]);

  // Get next chapter
  const getNextChapter = useCallback((currentChapterId: string) => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapterId);
    return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined;
  }, [chapters]);

  // Get previous chapter
  const getPreviousChapter = useCallback((currentChapterId: string) => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapterId);
    return currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
  }, [chapters]);

  // Update chapter progress
  const updateChapterProgress = useCallback(async (
    chapterId: string, 
    progress: Partial<ChapterProgress>
  ) => {
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
      
      await updateData('current-progress', updatedProgress);
      refreshChapters();
    } catch (error) {
      console.error('Failed to update chapter progress:', error);
    }
  }, [updateData, refreshChapters]);

  // Update current chapter
  const updateCurrentChapter = useCallback(async (chapterId: string) => {
    try {
      const updatedProgress = {
        ...defaultProgress,
        currentChapter: chapterId,
        lastRead: new Date()
      };
      
      await updateData('current-progress', updatedProgress);
    } catch (error) {
      console.error('Failed to update current chapter:', error);
    }
  }, [updateData]);

  // Mark chapter as complete
  const markChapterComplete = useCallback(async (chapterId: string) => {
    try {
      const chapter = getChapterById(chapterId);
      if (!chapter) return;

      await updateChapterProgress(chapterId, {
        lastPosition: 100,
        isComplete: true
      });
    } catch (error) {
      console.error('Failed to mark chapter as complete:', error);
    }
  }, [getChapterById, updateChapterProgress]);

  // Calculate reading progress
  const getReadingProgress = useCallback(() => {
    const completedChapters = Object.values(defaultProgress.chapterProgress)
      .filter(progress => progress.isComplete)
      .length;
    
    return chapters.length > 0 
      ? (completedChapters / chapters.length) * 100 
      : 0;
  }, [chapters.length]);

  const value: StoryContextValue = {
    chapters,
    storyProgress: defaultProgress,
    isLoading: chaptersLoading,
    error: chaptersError,
    getChapterById,
    updateChapterProgress,
    updateCurrentChapter,
    getNextChapter,
    getPreviousChapter,
    markChapterComplete,
    getReadingProgress
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};

/**
 * Hook to use story context
 * @throws {Error} If used outside of StoryProvider
 */
export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export default StoryContext;