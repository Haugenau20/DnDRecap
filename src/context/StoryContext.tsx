// context/StoryContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chapter, ChapterProgress, StoryProgress } from '../types/story';

// Import story data
import storyData from '../data/story/story.json';

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

// Raw types that match the JSON structure
interface RawChapter {
  id: string;
  title: string;
  content: string;
  order: number;
  lastModified: string;
  summary?: string;
  subChapters?: RawChapter[];
}

interface RawChapterProgress {
  chapterId: string;
  lastPosition: number;
  isComplete: boolean;
  lastRead: string;
}

interface RawStoryProgress {
  currentChapter: string;
  lastRead: string;
  chapterProgress: Record<string, RawChapterProgress>;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

/**
 * Convert a raw chapter from JSON to a proper Chapter type
 */
const convertChapter = (rawChapter: RawChapter): Chapter => ({
  ...rawChapter,
  lastModified: new Date(rawChapter.lastModified),
  subChapters: rawChapter.subChapters?.map(convertChapter)
});

/**
 * Convert raw chapter progress from JSON to proper ChapterProgress type
 */
const convertChapterProgress = (rawProgress: RawChapterProgress): ChapterProgress => ({
  ...rawProgress,
  lastRead: new Date(rawProgress.lastRead)
});

/**
 * Convert raw story progress from JSON to proper StoryProgress type
 */
const convertStoryProgress = (rawProgress: RawStoryProgress): StoryProgress => ({
  currentChapter: rawProgress.currentChapter,
  lastRead: new Date(rawProgress.lastRead),
  chapterProgress: Object.entries(rawProgress.chapterProgress).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: convertChapterProgress(value)
    }),
    {} as Record<string, ChapterProgress>
  )
});

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoryContextState>({
    chapters: [],
    storyProgress: {
      currentChapter: '',
      lastRead: new Date(),
      chapterProgress: {}
    },
    isLoading: true,
    error: null,
  });

  // Load story data
  useEffect(() => {
    try {
      const convertedChapters = (storyData.chapters as RawChapter[]).map(convertChapter);
      const convertedProgress = convertStoryProgress(storyData.storyProgress as RawStoryProgress);

      setState({
        chapters: convertedChapters,
        storyProgress: convertedProgress,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading story data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load story data',
      }));
    }
  }, []);

  // Get chapter by ID
  const getChapterById = (id: string) => {
    return state.chapters.find(chapter => chapter.id === id);
  };

  // Update chapter progress
  const updateChapterProgress = (chapterId: string, progress: Partial<ChapterProgress>) => {
    setState(prev => ({
      ...prev,
      storyProgress: {
        ...prev.storyProgress,
        chapterProgress: {
          ...prev.storyProgress.chapterProgress,
          [chapterId]: {
            ...prev.storyProgress.chapterProgress[chapterId],
            ...progress,
            chapterId,
            lastRead: new Date() // Always update lastRead when progress changes
          }
        }
      }
    }));
  };

  // Update current chapter
  const updateCurrentChapter = (chapterId: string) => {
    setState(prev => ({
      ...prev,
      storyProgress: {
        ...prev.storyProgress,
        currentChapter: chapterId,
        lastRead: new Date()
      }
    }));
  };

  const value: StoryContextValue = {
    ...state,
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