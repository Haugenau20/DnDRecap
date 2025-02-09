// src/context/FirebaseContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import FirebaseService from '../services/firebase/FirebaseService';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const firebaseService = FirebaseService.getInstance();

  useEffect(() => {
    // Listen for auth state changes
    const user = firebaseService.getCurrentUser();
    setUser(user);
    setLoading(false);

    return () => {
      // No cleanup needed for getCurrentUser
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const user = await firebaseService.signIn(email, password);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const user = await firebaseService.signUp(email, password);
      setUser(user);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
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