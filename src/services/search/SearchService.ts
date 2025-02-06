// src/services/search/SearchService.ts
import { SearchResult, SearchResultType, SearchDocument } from '../../types/search';
import _ from 'lodash';

/**
 * Options for configuring search behavior
 */
export interface SearchOptions {
  /** Number of characters of context to include around matches */
  contextLength?: number;
  /** Minimum length of search query */
  minQueryLength?: number;
  /** Maximum number of results per category */
  maxResultsPerType?: number;
  /** Whether to use fuzzy matching */
  fuzzyMatch?: boolean;
}

/**
 * Default search configuration options
 */
const DEFAULT_OPTIONS: SearchOptions = {
  contextLength: 50,
  minQueryLength: 2,
  maxResultsPerType: 10,
  fuzzyMatch: true
};

/**
 * Service class for handling search functionality across the application
 */
export class SearchService {
  private searchIndex: Map<SearchResultType, SearchDocument[]>;
  private options: SearchOptions;

  constructor(options: SearchOptions = {}) {
    this.searchIndex = new Map();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Initialize the search index with documents
   * @param documents - Documents to index by type
   */
  public initializeIndex(documents: Record<SearchResultType, SearchDocument[]>): void {
    Object.entries(documents).forEach(([type, docs]) => {
      this.searchIndex.set(type as SearchResultType, docs);
    });
  }

  /**
   * Perform a search across all indexed documents
   * @param query - Search query string
   * @returns Array of search results
   */
  public search(query: string): SearchResult[] {
    if (!query || query.length < (this.options.minQueryLength || 2)) {
      return [];
    }

    const results: SearchResult[] = [];
    this.searchIndex.forEach((documents, type) => {
      const typeResults = this.searchDocuments(documents, query);
      results.push(...typeResults);
    });

    return this.processResults(results);
  }

  /**
   * Add a new document to the search index
   * @param document - Document to add
   */
  public addDocument(document: SearchDocument): void {
    const documents = this.searchIndex.get(document.type) || [];
    documents.push(document);
    this.searchIndex.set(document.type, documents);
  }

  /**
   * Remove a document from the search index
   * @param type - Document type
   * @param id - Document ID
   */
  public removeDocument(type: SearchResultType, id: string): void {
    const documents = this.searchIndex.get(type);
    if (documents) {
      this.searchIndex.set(
        type,
        documents.filter(doc => doc.id !== id)
      );
    }
  }

  /**
   * Clear the entire search index
   */
  public clearIndex(): void {
    this.searchIndex.clear();
  }

  /**
   * Search through a set of documents
   * @param documents - Documents to search
   * @param query - Search query
   * @returns Array of search results
   */
  private searchDocuments(documents: SearchDocument[], query: string): SearchResult[] {
    return documents
      .filter(doc => this.matchDocument(doc, query))
      .map(doc => this.createSearchResult(doc, query));
  }

  /**
   * Check if a document matches the search query
   * @param document - Document to check
   * @param query - Search query
   * @returns Boolean indicating if document matches
   */
  private matchDocument(document: SearchDocument, query: string): boolean {
    const searchText = this.prepareText(document.content);
    const searchQuery = this.prepareText(query);

    if (this.options.fuzzyMatch) {
      return this.fuzzyMatch(searchText, searchQuery);
    }

    return searchText.includes(searchQuery);
  }

  /**
   * Create a formatted search result from a matching document
   * @param document - Matching document
   * @param query - Search query
   * @returns Formatted search result
   */
  private createSearchResult(document: SearchDocument, query: string): SearchResult {
    return {
      id: document.id,
      type: document.type,
      title: document.metadata.title as string || '',
      content: document.content,
      matches: this.extractMatches(document.content, query)
    };
  }

  /**
   * Extract matching text segments with surrounding context
   * @param text - Text to extract from
   * @param query - Search query
   * @returns Array of text segments containing matches
   */
  private extractMatches(text: string, query: string): string[] {
    const contextLength = this.options.contextLength || 50;
    const matches: string[] = [];
    const words = query.toLowerCase().split(' ');
    const textLower = text.toLowerCase();

    words.forEach(word => {
      let index = textLower.indexOf(word);
      while (index !== -1) {
        const start = Math.max(0, index - contextLength);
        const end = Math.min(text.length, index + word.length + contextLength);
        matches.push(text.slice(start, end));
        index = textLower.indexOf(word, index + 1);
      }
    });

    return _.uniq(matches);
  }

  /**
   * Perform fuzzy matching between text and query
   * @param text - Text to search in
   * @param query - Search query
   * @returns Boolean indicating if text matches query
   */
  private fuzzyMatch(text: string, query: string): boolean {
    const words = query.split(' ');
    return words.every(word => {
      const pattern = word.split('').join('.*');
      const regex = new RegExp(pattern, 'i');
      return regex.test(text);
    });
  }

  /**
   * Prepare text for searching by normalizing
   * @param text - Text to prepare
   * @returns Normalized text
   */
  private prepareText(text: string): string {
    return text.toLowerCase().trim();
  }

  /**
   * Process and sort search results
   * @param results - Raw search results
   * @returns Processed and sorted results
   */
  private processResults(results: SearchResult[]): SearchResult[] {
    const maxResults = this.options.maxResultsPerType || 10;
    
    // Group by type and limit results per type
    const groupedResults = _.groupBy(results, 'type');
    return _.flatMap(groupedResults, typeResults => 
      typeResults.slice(0, maxResults)
    );
  }
}

export default SearchService;