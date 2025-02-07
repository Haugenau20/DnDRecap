// context/SearchContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { SearchResult, SearchResultType, SearchDocument } from '../types/search';
import { SearchService } from '../services/search/SearchService';
import { Chapter } from '../types/story';

// Import sample data (in a real app, this would come from an API or database)
import questData from '../data/quests/metadata/quests.json';
import npcData from '../data/npcs/npcs.json';
import locationData from '../data/locations/locations.json';

interface SearchContextData {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  handleSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextData | undefined>(undefined);

// Sample chapters - replace with actual data source
const sampleChapters = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: The Beginning',
    content: 'It was a dark and stormy night in the realm of Faerûn...',
    order: 1
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: The First Quest',
    content: 'The party gathered at the Yawning Portal Inn...',
    order: 2
  }
];

/**
 * Convert quest data to search documents
 */
const createQuestSearchDocuments = (): SearchDocument[] => {
  return questData.quests.map(quest => ({
    id: quest.id,
    type: 'quest' as SearchResultType,
    content: `${quest.title} ${quest.description} ${quest.objectives.map(obj => obj.description).join(' ')}`,
    metadata: {
      title: quest.title,
      status: quest.status
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
      title: npc.name,
      location: npc.location
    }
  }));
};

/**
 * Convert location data to search documents
 */
const createLocationSearchDocuments = (): SearchDocument[] => {
  return locationData.locations.map(location => ({
    id: location.id,
    type: 'location' as SearchResultType,
    content: `${location.name} ${location.description} ${location.features?.join(' ')} ${location.tags?.join(' ')}`,
    metadata: {
      title: location.name,
      type: location.type,
      status: location.status
    }
  }));
};

/**
 * Convert story chapters to search documents
 */
const createStorySearchDocuments = (chapters: Chapter[]): SearchDocument[] => {
  return chapters.map(chapter => ({
    id: chapter.id,
    type: 'story' as SearchResultType,
    content: `${chapter.title} ${chapter.content} ${chapter.summary || ''}`,
    metadata: {
      title: chapter.title,
      order: chapter.order
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
          story: createStorySearchDocuments(sampleChapters), // Replace with actual chapters
          quest: createQuestSearchDocuments(),
          npc: createNPCSearchDocuments(),
          location: createLocationSearchDocuments()
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