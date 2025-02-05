// hooks/useSearch.ts
import { useCallback, useEffect, useState } from 'react';
import { useSearch as useSearchContext } from '../context/SearchContext';

/**
 * Custom hook for handling debounced search functionality
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Object containing debounced search handlers
 */
export const useSearch = (debounceMs = 300) => {
  const { query, setQuery, handleSearch, clearSearch } = useSearchContext();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  const onSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, [setQuery]);

  return {
    onSearch,
    clearSearch,
    debouncedQuery
  };
};

export default useSearch;