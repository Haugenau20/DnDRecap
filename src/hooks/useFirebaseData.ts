// src/hooks/useFirebaseData.ts
import { useState, useCallback, useEffect } from 'react';
import FirebaseService from '../services/firebase/FirebaseService';

interface UseFirebaseDataOptions<T> {
  collection: string;
  idField?: keyof T;
}

export function useFirebaseData<T extends Record<string, any>>(
  options: UseFirebaseDataOptions<T>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const firebaseService = FirebaseService.getInstance();

  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedData = await firebaseService.getCollection<T>(options.collection);
      setData(fetchedData);
      return fetchedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [options.collection]);

  // Add useEffect to fetch data on mount
  useEffect(() => {
    getData();
  }, [getData]);

  const addData = useCallback(async (newData: T, documentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const id = documentId || 
                (options.idField ? newData[options.idField] as string : crypto.randomUUID());
                
      await firebaseService.setDocument(options.collection, id, newData);
      setData(prevData => [...prevData, { ...newData, id }]);
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.collection, options.idField]);

  const updateData = useCallback(async (id: string, updatedData: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseService.updateDocument(options.collection, id, updatedData);
      setData(prevData => 
        prevData.map(item => 
          'id' in item && item.id === id ? { ...item, ...updatedData } : item
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update data';
      setError(errorMessage);
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
      setData(prevData => prevData.filter(item => 'id' in item && item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.collection]);

  return {
    data,
    loading,
    error,
    getData, // Expose getData for manual refreshes
    addData,
    updateData,
    deleteData
  };
}