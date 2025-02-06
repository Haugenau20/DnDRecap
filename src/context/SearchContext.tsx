// context/SearchContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { SearchResult, SearchResultType, SearchDocument } from '../types/search';
import { SearchService } from '../services/search/SearchService';

// Import sample data (in a real app, this would come from an API or database)
import questData from '../data/quests/metadata/quests.json';
import npcData from '../data/npcs/npcs.json';

interface SearchContextData {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  handleSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextData | undefined>(undefined);

/**
 * Convert quest data to search documents
 */
const createQuestSearchDocuments = (): SearchDocument[] => {
  return questData.quests.map(quest => ({
    id: quest.id,
    type: 'quest' as SearchResultType,
    content: `${quest.title} ${quest.description} ${quest.objectives.map(obj => obj.description).join(' ')}`,
    metadata: {
      title: quest.title
    }
  }));
};

/**
 * Convert NPC data to search documents
 */
const createNPCSearchDocuments = (): SearchDocument[] => {
  return npcData.npcs.map(npc => ({
    id: npc.id,
    type: 'npc' as SearchResultType,
    content: `${npc.name} ${npc.description} ${npc.background || ''} ${npc.occupation || ''}`,
    metadata: {
      title: npc.name
    }
  }));
};

/**
 * Provider component for global search functionality
 */
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize SearchService with options
  const searchService = useMemo(() => new SearchService({
    contextLength: 50,
    minQueryLength: 2,
    maxResultsPerType: 5,
    fuzzyMatch: true
  }), []);

  // Initialize search index with available data
  useEffect(() => {
    const initializeSearch = () => {
      try {
        const searchDocuments: Record<SearchResultType, SearchDocument[]> = {
          story: [], // Will be populated when story data is available
          quest: createQuestSearchDocuments(),
          npc: createNPCSearchDocuments(),
          location: [] // Will be populated when location data is available
        };

        searchService.initializeIndex(searchDocuments);
      } catch (error) {
        console.error('Error initializing search index:', error);
      }
    };

    initializeSearch();
  }, [searchService]);

  /**
   * Handle search query execution
   */
  const handleSearch = useCallback(async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const searchResults = searchService.search(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchService]);

  /**
   * Clear search state
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
  }, []);

  // Create context value
  const value = useMemo(() => ({
    query,
    setQuery,
    results,
    isSearching,
    handleSearch,
    clearSearch
  }), [query, results, isSearching, handleSearch, clearSearch]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Hook for accessing search context
 * @throws {Error} If used outside of SearchProvider
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};