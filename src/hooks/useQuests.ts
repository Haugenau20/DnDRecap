// src/hooks/useQuests.ts
import { useState, useEffect, useCallback } from 'react';
import { Quest } from '../types/quest';
import { useFirebaseData } from './useFirebaseData';

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { getData, loading, error } = useFirebaseData<Quest>({ 
    collection: 'quests'
  });

  /**
   * Fetch quests from Firebase
   */
  const fetchQuests = useCallback(async () => {
    try {
      const data = await getData();
      setQuests(data || []);
    } catch (err) {
      console.error('Error fetching quests:', err);
    }
  }, [getData]);

  // Load quests on mount
  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  /**
   * Get a quest by ID
   */
  const getQuestById = useCallback((id: string) => {
    return quests.find(quest => quest.id === id);
  }, [quests]);

  return {
    quests,
    loading,
    error,
    getQuestById,
    refreshQuests: fetchQuests
  };
};