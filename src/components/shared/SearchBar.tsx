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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    clearSearch();
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    } else if (e.key === 'ArrowDown' && results.length > 0) {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length > 0) {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
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

    return results.map((result, index) => (
      <div
        key={result.id}
        className={`p-2 cursor-pointer ${
          index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        role="option"
        aria-selected={index === selectedIndex}
        onClick={() => setSelectedIndex(index)}
      >
        <div className="font-medium">{result.title}</div>
        <div className="text-sm text-gray-600">{result.type}</div>
        {result.matches.map((match, matchIndex) => (
          <div key={matchIndex} className="text-sm text-gray-500">
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
          role="combobox"
          aria-controls="search-results"
          aria-expanded={isFocused && results.length > 0}
          aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
          aria-owns="search-results"
          aria-haspopup="listbox"
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
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {renderResults(results)}
        </div>
      )}
    </div>
  );
};

export default SearchBar;