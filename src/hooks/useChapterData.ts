// src/hooks/useChapterData.ts
import { useState, useEffect, useCallback } from 'react';
import { Chapter } from '../types/story';
import { useFirebaseData } from './useFirebaseData';

/**
 * Hook for managing chapter data fetching and state
 * @returns Object containing chapters data, loading state, error state, and refresh function
 */
export const useChapterData = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { getData, loading, error } = useFirebaseData<Chapter>({ collection: 'chapters' });

  /**
   * Fetch chapters from Firebase
   */
  const fetchChapters = useCallback(async () => {
    try {
      const data = await getData();
      // Sort chapters by order number
      const sortedChapters = data.sort((a, b) => a.order - b.order);
      setChapters(sortedChapters);
    } catch (err) {
      console.error('Error fetching chapters:', err);
    }
  }, [getData]);

  // Load chapters on mount
  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  return {
    chapters,
    loading,
    error,
    refreshChapters: fetchChapters
  };
};

export default useChapterData;