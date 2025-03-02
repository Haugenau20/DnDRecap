// src/hooks/useQuests.ts
import { useState, useEffect, useCallback } from 'react';
import { Quest } from '../types/quest';
import { useFirebaseData } from './useFirebaseData';
import { useFirebase } from '../context/FirebaseContext';

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { getData, loading, error, data } = useFirebaseData<Quest>({ 
    collection: 'quests'
  });
  const { user } = useFirebase();

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

  // Update quests when Firebase data changes
  useEffect(() => {
    if (data.length > 0) {
      setQuests(data);
    } else if (!user) {
      // Clear quests when signed out
      setQuests([]);
    }
  }, [data, user]);

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