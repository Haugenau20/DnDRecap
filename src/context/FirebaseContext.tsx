// src/context/FirebaseContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import FirebaseService from '../services/firebase/FirebaseService';
import { PlayerProfile, UserWithProfile, UsernameValidationResult, AllowedUser } from '../types/user';

interface FirebaseContextType {
  user: User | null;
  userProfile: PlayerProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  validateUsername: (username: string) => Promise<UsernameValidationResult>;
  changeUsername: (uid: string, newUsername: string) => Promise<void>;
  isUsernameAvailable: (username: string) => Promise<boolean>;
  isEmailAllowed: (email: string) => Promise<boolean>;
  isUserAdmin: (uid: string) => Promise<boolean>;
  addAllowedUser: (email: string, notes?: string) => Promise<void>;
  removeAllowedUser: (email: string) => Promise<void>;
  getAllowedUsers: () => Promise<AllowedUser[]>;
  removeUserCompletely: (email: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const firebaseService = FirebaseService.getInstance();

  // Fetch user profile
  const fetchUserProfile = useCallback(async (user: User) => {
    try {
      const profile = await firebaseService.getPlayerProfile(user.uid);
      setUserProfile(profile);
      
      // Check if user is admin
      if (profile?.isAdmin) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    }
  }, []);

  // Listen to authentication state changes
  useEffect(() => {
    const auth = firebaseService.getAuth();
    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        setUser(user);
        
        if (user) {
          await fetchUserProfile(user);
        } else {
          setUserProfile(null);
          setIsAdmin(false);
        }
        
        setLoading(false); // Set loading to false once we have the auth state
      },
      (error) => {
        console.error('Auth state error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      // Get user from Firebase auth
      const user = await firebaseService.signIn(email, password);
      // Update application state
      setUser(user);
      // Try to fetch profile, but don't let it affect sign-in success
      try {
        await fetchUserProfile(user);
      } catch (profileErr) {
        console.error("Error fetching profile, but user is authenticated:", profileErr);
        // Don't throw here - user is still authenticated
      }
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      // First check if email is allowed
      const isAllowed = await firebaseService.isEmailAllowed(email);
      if (!isAllowed) {
        throw new Error('This email is not authorized to create an account. Please contact your administrator.');
      }
      
      const user = await firebaseService.signUp(email, password, username);
      setUser(user);
      await fetchUserProfile(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseService.signOut();
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
      throw err;
    }
  };

  // Add the implementation in the FirebaseProvider component
  const removeUserCompletely = async (email: string) => {
    try {
      setError(null);
      
      // Check if current user is admin
      if (!isAdmin) {
        throw new Error('Only admins can remove users completely');
      }
      
      await firebaseService.removeUserCompletely(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred removing user');
      throw err;
    }
  };

  // Check if an email is allowed to register
  const isEmailAllowed = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      return await firebaseService.isEmailAllowed(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred checking email permission');
      return false;
    }
  };

  // Validate username format and availability
  const validateUsername = async (username: string): Promise<UsernameValidationResult> => {
    try {
      setError(null);
      return await firebaseService.validateUsername(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred validating username');
      throw err;
    }
  };

  // Change username
  const changeUsername = async (uid: string, newUsername: string): Promise<void> => {
    try {
      setError(null);
      await firebaseService.changeUsername(uid, newUsername);
      
      // Update the profile in state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          username: newUsername
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred changing username');
      throw err;
    }
  };

  // Check if username is available
  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    try {
      setError(null);
      return await firebaseService.isUsernameAvailable(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred checking username availability');
      throw err;
    }
  };

  // Check if user is admin
  const isUserAdmin = async (uid: string): Promise<boolean> => {
    try {
      return await firebaseService.isUserAdmin(uid);
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  };

  // Add allowed user (admin only)
  const addAllowedUser = async (email: string, notes: string = '') => {
    try {
      setError(null);
      
      // Check if current user is admin
      if (!isAdmin || !user) {
        throw new Error('Only admins can add allowed users');
      }
      
      await firebaseService.addAllowedUser(email, notes, user.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred adding allowed user');
      throw err;
    }
  };

  // Remove allowed user (admin only)
  const removeAllowedUser = async (email: string) => {
    try {
      setError(null);
      
      // Check if current user is admin
      if (!isAdmin) {
        throw new Error('Only admins can remove allowed users');
      }
      
      await firebaseService.removeAllowedUser(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred removing allowed user');
      throw err;
    }
  };

  // Get all allowed users (admin only)
  const getAllowedUsers = async (): Promise<AllowedUser[]> => {
    try {
      setError(null);
      
      // Check if current user is admin
      if (!isAdmin) {
        throw new Error('Only admins can view allowed users');
      }
      
      return await firebaseService.getAllowedUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred getting allowed users');
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    validateUsername,
    changeUsername,
    isUsernameAvailable,
    isEmailAllowed,
    isUserAdmin,
    addAllowedUser,
    removeAllowedUser,
    getAllowedUsers,
    removeUserCompletely
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};