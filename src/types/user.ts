// src/types/user.ts
import { User as FirebaseUser } from 'firebase/auth';

/**
 * Player profile information stored in the users collection
 */
export interface PlayerProfile {
  /** User's email address from Firebase Authentication */
  email: string;
  /** User's chosen unique username */
  username: string;
  /** Optional display name (different from username) */
  displayName?: string;
  /** Timestamp when the account was created */
  dateCreated: Date | string;
  /** Timestamp of last login */
  lastLogin: Date | string;
  /** Optional character names associated with this player */
  characterNames?: string[];
  /** Whether user has admin privileges */
  isAdmin?: boolean;
  /** User preferences */
  preferences?: {
    /** UI theme preference */
    theme: string;
    [key: string]: any;
  };
}

/**
 * Username document stored in the usernames collection
 */
export interface UsernameDocument {
  /** Reference to the user's UID in users collection */
  uid: string;
  /** Original username with preserved case for display */
  originalUsername: string;
  /** When the username was created */
  createdAt: Date | string;
}

/**
 * Represents a pre-approved user who can register
 */
export interface AllowedUser {
  /** Email address that is allowed to register */
  email: string;
  /** Notes about this user (optional) */
  notes?: string;
  /** Date when the user was added to the allowlist */
  addedAt: Date | string;
  /** UID of the admin who added this user */
  addedBy?: string;
  /** Whether the user has registered yet */
  hasRegistered?: boolean;
  /** Date when the user registered */
  registeredAt?: Date | string;
}

/**
 * Extended user type that includes Firebase user and profile
 */
export interface UserWithProfile extends FirebaseUser {
  /** User's profile information */
  profile?: PlayerProfile;
}

/**
 * Username validation result
 */
export interface UsernameValidationResult {
  /** Whether the username is valid */
  isValid: boolean;
  /** Error message if not valid */
  error?: string;
  /** Whether the username is available */
  isAvailable?: boolean;
}