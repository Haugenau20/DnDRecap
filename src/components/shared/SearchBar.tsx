// components/shared/SearchBar.tsx
import React, { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { SearchResult } from '../../types/search';

/**
 * SearchBar component with real-time search functionality and results dropdown
 */
export const SearchBar: React.FC = () => {
  const { query, setQuery, results, isSearching, handleSearch, clearSearch } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation for accessibility
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const renderResults = (results: SearchResult[]) => {
    if (!results.length) {
      return (
        <div className="p-4 text-gray-500">
          No results found
        </div>
      );
    }

    return results.map((result) => (
      <div
        key={result.id}
        className="p-2 hover:bg-gray-100 cursor-pointer"
        role="option"
      >
        <div className="font-medium">{result.title}</div>
        <div className="text-sm text-gray-600">{result.type}</div>
        {result.matches.map((match, index) => (
          <div key={index} className="text-sm text-gray-500">
            ...{match}...
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search stories, quests, NPCs..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
          aria-expanded={isFocused && isSearching}
          role="searchbox"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && isSearching && (
        <div
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          role="listbox"
        >
          {renderResults(results)}
        </div>
      )}
    </div>
  );
};

export default SearchBar;