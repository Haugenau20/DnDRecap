// src/hooks/useFirebaseData.ts
import { useState, useCallback } from 'react';
import FirebaseService from '../services/firebase/FirebaseService';

interface UseFirebaseDataOptions<T> {
  collection: string;
  idField?: keyof T;
}

export function useFirebaseData<T extends Record<string, any>>(
  options: UseFirebaseDataOptions<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firebaseService = FirebaseService.getInstance();

  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await firebaseService.getCollection<T>(options.collection);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.collection]);

  const addData = useCallback(async (data: T, documentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use the provided documentId or generate one from data[idField] if specified
      const id = documentId || 
                (options.idField ? data[options.idField] as string : crypto.randomUUID());
                
      await firebaseService.setDocument(options.collection, id, data);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.collection, options.idField]);

  const updateData = useCallback(async (id: string, data: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseService.updateDocument(options.collection, id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.collection]);

  const deleteData = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseService.deleteDocument(options.collection, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.collection]);

  return {
    loading,
    error,
    getData,
    addData,
    updateData,
    deleteData
  };
}