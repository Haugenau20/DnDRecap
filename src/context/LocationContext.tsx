// src/context/LocationContext.tsx
import React, { createContext, useContext, useCallback } from 'react';
import { Location, LocationType, LocationNote, LocationContextValue } from '../types/location';
import { useLocationData } from '../hooks/useLocationData';
import { useFirebaseData } from '../hooks/useFirebaseData';

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locations, loading, error, refreshLocations } = useLocationData();
  const { updateData } = useFirebaseData<Location>({ collection: 'locations' });

  // Get location by ID
  const getLocationById = useCallback((id: string) => {
    return locations.find(location => location.id === id);
  }, [locations]);

  // Get locations by type
  const getLocationsByType = useCallback((type: LocationType) => {
    return locations.filter(location => location.type === type);
  }, [locations]);

  // Get locations by status
  const getLocationsByStatus = useCallback((status: Location['status']) => {
    return locations.filter(location => location.status === status);
  }, [locations]);

  // Get child locations
  const getChildLocations = useCallback((parentId: string) => {
    return locations.filter(location => location.parentId === parentId);
  }, [locations]);

  // Get parent location
  const getParentLocation = useCallback((locationId: string) => {
    const location = getLocationById(locationId);
    if (location?.parentId) {
      return getLocationById(location.parentId);
    }
    return undefined;
  }, [getLocationById]);

  // Update location note
  const updateLocationNote = useCallback(async (locationId: string, note: LocationNote) => {
    const location = getLocationById(locationId);
    if (location) {
      const updatedLocation = {
        ...location,
        notes: [...(location.notes || []), note]
      };
      await updateData(locationId, updatedLocation);
      refreshLocations(); // Refresh to get updated data
    }
  }, [getLocationById, updateData, refreshLocations]);

  // Update location status
  const updateLocationStatus = useCallback(async (locationId: string, status: Location['status']) => {
    const location = getLocationById(locationId);
    if (location) {
      const updatedLocation = {
        ...location,
        status
      };
      await updateData(locationId, updatedLocation);
      refreshLocations(); // Refresh to get updated data
    }
  }, [getLocationById, updateData, refreshLocations]);

  const value: LocationContextValue = {
    locations,
    isLoading: loading,
    error,
    getLocationById,
    getLocationsByType,
    getLocationsByStatus,
    getChildLocations,
    getParentLocation,
    updateLocationNote,
    updateLocationStatus,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
};