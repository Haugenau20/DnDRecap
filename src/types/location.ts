// types/location.ts

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
 * Represents a note or update about a location
 */
export interface LocationNote {
  /** Unique identifier for the note */
  id: string;
  /** The note content */
  content: string;
  /** Session date or when the note was added */
  date: string;
  /** Optional session number */
  sessionNumber?: number;
  /** Optional tags for categorizing notes */
  tags?: string[];
}