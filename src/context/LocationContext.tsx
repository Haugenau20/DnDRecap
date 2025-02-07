import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, LocationType, LocationNote } from '../types/location';

// Import location data
import locationData from '../data/locations/locations.json';

interface LocationContextState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
}

interface LocationContextValue extends LocationContextState {
  getLocationById: (id: string) => Location | undefined;
  getLocationsByType: (type: LocationType) => Location[];
  getLocationsByStatus: (status: Location['status']) => Location[];
  getChildLocations: (parentId: string) => Location[];
  updateLocationNote: (locationId: string, note: LocationNote) => void;
  updateLocationStatus: (locationId: string, status: Location['status']) => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationContextState>({
    locations: [],
    isLoading: true,
    error: null,
  });

  // Load location data
  useEffect(() => {
    try {
      setState({
        locations: locationData.locations as Location[],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load location data',
      }));
    }
  }, []);

  // Get location by ID
  const getLocationById = (id: string) => {
    return state.locations.find(location => location.id === id);
  };

  // Get locations by type
  const getLocationsByType = (type: LocationType) => {
    return state.locations.filter(location => location.type === type);
  };

  // Get locations by status
  const getLocationsByStatus = (status: Location['status']) => {
    return state.locations.filter(location => location.status === status);
  };

  // Get child locations
  const getChildLocations = (parentId: string) => {
    return state.locations.filter(location => location.parentId === parentId);
  };

  // Update location note
  const updateLocationNote = (locationId: string, note: LocationNote) => {
    setState(prev => ({
      ...prev,
      locations: prev.locations.map(location =>
        location.id === locationId
          ? {
              ...location,
              notes: [...(location.notes || []), note]
            }
          : location
      ),
    }));
  };

  // Update location status
  const updateLocationStatus = (locationId: string, status: Location['status']) => {
    setState(prev => ({
      ...prev,
      locations: prev.locations.map(location =>
        location.id === locationId
          ? { ...location, status }
          : location
      ),
    }));
  };

  const value: LocationContextValue = {
    ...state,
    getLocationById,
    getLocationsByType,
    getLocationsByStatus,
    getChildLocations,
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