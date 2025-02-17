// src/hooks/useNPCData.ts
import { useState, useEffect, useCallback } from 'react';
import { NPC } from '../types/npc';
import { useFirebaseData } from './useFirebaseData';

/**
 * Hook for managing NPC data fetching and state
 * @returns Object containing NPCs data, loading state, error state, and refresh function
 */
export const useNPCData = () => {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const { getData, loading, error } = useFirebaseData<NPC>({ collection: 'npcs' });

  /**
   * Fetch NPCs from Firebase
   */
  const fetchNPCs = useCallback(async () => {
    try {
      const data = await getData();
      // Sort NPCs alphabetically by name
      const sortedNPCs = data.sort((a, b) => a.name.localeCompare(b.name));
      setNpcs(sortedNPCs);
    } catch (err) {
      console.error('Error fetching NPCs:', err);
    }
  }, [getData]);

  // Load NPCs on mount
  useEffect(() => {
    fetchNPCs();
  }, [fetchNPCs]);

  return {
    npcs,
    loading,
    error,
    refreshNPCs: fetchNPCs
  };
};

export default useNPCData;