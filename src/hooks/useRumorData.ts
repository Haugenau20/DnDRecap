// src/hooks/useRumorData.ts
import { useState, useEffect, useCallback } from 'react';
import { Rumor } from '../types/rumor';
import { useFirebaseData } from './useFirebaseData';

export const useRumorData = () => {
  const [rumors, setRumors] = useState<Rumor[]>([]);
  const { getData, loading, error } = useFirebaseData<Rumor>({ collection: 'rumors' });

  /**
   * Fetch rumors from Firebase
   */
  const fetchRumors = useCallback(async () => {
    try {
      const data = await getData();
      setRumors(data || []);
    } catch (err) {
      console.error('Error fetching rumors:', err);
    }
  }, [getData]);

  // Load rumors on mount
  useEffect(() => {
    fetchRumors();
  }, [fetchRumors]);

  return {
    rumors,
    loading,
    error,
    refreshRumors: fetchRumors
  };
};

export default useRumorData;