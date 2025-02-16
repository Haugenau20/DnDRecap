// src/hooks/useLocationData.ts
import { useState, useEffect, useCallback } from 'react';
import { Location } from '../types/location';
import { useFirebaseData } from './useFirebaseData';

/**
 * Hook for managing location data fetching and state
 * @returns Object containing locations data, loading state, error state, and refresh function
 */
export const useLocationData = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { getData, loading, error } = useFirebaseData<Location>({ collection: 'locations' });

  /**
   * Fetch locations from Firebase
   */
  const fetchLocations = useCallback(async () => {
    try {
      const data = await getData();
      setLocations(data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  }, [getData]);

  // Load locations on mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    error,
    refreshLocations: fetchLocations
  };
};

export default useLocationData;