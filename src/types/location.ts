/**
 * Types of locations that can exist in the game world
 */
export type LocationType = 
  | 'region'
  | 'city'
  | 'town'
  | 'village'
  | 'dungeon'
  | 'landmark'
  | 'building'
  | 'poi';

/**
 * Current status of a location
 */
export type LocationStatus =
  | 'undiscovered'
  | 'discovered'
  | 'visited';

/**
 * Represents a location in the game world
 */
export interface Location {
  /** Unique identifier for the location */
  id: string;
  /** Name of the location */
  name: string;
  /** Type of location */
  type: LocationType;
  /** Discovery status */
  status: LocationStatus;
  /** Detailed description */
  description: string;
  /** Parent location ID (for nested locations) */
  parentId?: string;
  /** Notable features of the location */
  features?: string[];
  /** Connected NPCs */
  connectedNPCs?: string[];
  /** Associated quests */
  relatedQuests?: string[];
  /** Session notes and updates */
  notes?: LocationNote[];
  /** Tags for organization */
  tags?: string[];
  /** Last session visited */
  lastVisited?: string;
}

/**
 * Note for a location
 */
export interface LocationNote {
  id: string;
  content: string;
  date: string;
  sessionNumber?: number;
  tags?: string[];
}

/**
 * Context state for locations
 */
export interface LocationContextState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Context value including state and methods
 */
export interface LocationContextValue extends LocationContextState {
  getLocationById: (id: string) => Location | undefined;
  getLocationsByType: (type: LocationType) => Location[];
  getLocationsByStatus: (status: LocationStatus) => Location[];
  getChildLocations: (parentId: string) => Location[];
  getParentLocation: (locationId: string) => Location | undefined;
  updateLocationNote: (locationId: string, note: LocationNote) => void;
  updateLocationStatus: (locationId: string, status: LocationStatus) => void;
}