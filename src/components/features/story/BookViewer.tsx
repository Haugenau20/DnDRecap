import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';

interface BookViewerProps {
  content: string;
  title: string;
  onPageChange?: (page: number) => void;
  onNextChapter?: () => void;
  onPreviousChapter?: () => void;
  hasNextChapter?: boolean;
  hasPreviousChapter?: boolean;
  className?: string;
}

const BookViewer = ({
  content,
  title,
  onPageChange,
  onNextChapter,
  onPreviousChapter,
  hasNextChapter = false,
  hasPreviousChapter = false,
  className
}: BookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [showShortcutHint, setShowShortcutHint] = useState(true);
  
  // Refs for content measuring
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Function to split text into lines that fit within the container
  const splitContentIntoPages = useCallback(() => {
    if (!containerRef.current || !measureRef.current || !content) return;

    const containerHeight = containerRef.current.clientHeight;
    const lines = content.split('\n');
    const pages: string[] = [];
    let currentPage: string[] = [];
    let currentHeight = 0;

    // Helper function to measure text height
    const measureTextHeight = (text: string): number => {
      measureRef.current!.textContent = text;
      return measureRef.current!.offsetHeight;
    };

    for (let line of lines) {
      const lineHeight = measureTextHeight(line);
      
      // If adding this line would exceed page height, start a new page
      if (currentHeight + lineHeight > containerHeight - 40) { // 40px buffer
        pages.push(currentPage.join('\n'));
        currentPage = [line];
        currentHeight = lineHeight;
      } else {
        currentPage.push(line);
        currentHeight += lineHeight;
      }
    }

    // Add the last page if it has content
    if (currentPage.length > 0) {
      pages.push(currentPage.join('\n'));
    }

    setPages(pages);
    setTotalPages(pages.length);
  }, [content]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      splitContentIntoPages();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [splitContentIntoPages]);

  // Initial content split and on content change
  useEffect(() => {
    splitContentIntoPages();
  }, [content, splitContentIntoPages]);

  // Handle page navigation
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    } else if (newPage > totalPages && hasNextChapter) {
      onNextChapter?.();
    } else if (newPage < 1 && hasPreviousChapter) {
      onPreviousChapter?.();
    }
  }, [totalPages, hasNextChapter, hasPreviousChapter, onPageChange, onNextChapter, onPreviousChapter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          handlePageChange(currentPage + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          handlePageChange(currentPage - 1);
          break;
        case 'Home':
          e.preventDefault();
          handlePageChange(1);
          break;
        case 'End':
          e.preventDefault();
          handlePageChange(totalPages);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, handlePageChange]);

  // Hide keyboard shortcut hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowShortcutHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!content) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-8 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <Typography variant="h3" className="mb-2">
          No Content Available
        </Typography>
        <Typography color="muted">
          Select a chapter to begin reading
        </Typography>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Keyboard Shortcuts Hint */}
      {showShortcutHint && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4 transition-opacity duration-500">
          <Typography variant="body-sm">
            Tip: Use arrow keys or spacebar to navigate pages
          </Typography>
        </div>
      )}

      {/* Book Container */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Book Header */}
        <div className="bg-gray-50 border-b p-4">
          <Typography variant="h3" className="text-center">
            {title}
          </Typography>
        </div>

        {/* Chapter Navigation */}
        <div className="flex justify-between px-4 py-2 bg-gray-50 border-b">
          <Button
            variant="ghost"
            onClick={onPreviousChapter}
            disabled={!hasPreviousChapter}
            className="text-sm"
            startIcon={<ArrowLeftCircle className="w-4 h-4" />}
          >
            Previous Chapter
          </Button>
          <Button
            variant="ghost"
            onClick={onNextChapter}
            disabled={!hasNextChapter}
            className="text-sm"
            endIcon={<ArrowRightCircle className="w-4 h-4" />}
          >
            Next Chapter
          </Button>
        </div>

        {/* Book Content Area */}
        <div className="relative bg-amber-50">
          {/* Hidden measurement div */}
          <div 
            ref={measureRef}
            className="absolute opacity-0 pointer-events-none leading-relaxed font-serif whitespace-pre-line max-w-2xl mx-auto p-8"
            aria-hidden="true"
          />
          
          {/* Content Container */}
          <div 
            ref={containerRef}
            className="h-[800px] md:h-[600px] lg:h-[800px] max-w-2xl mx-auto p-8"
          >
            <Typography className="leading-relaxed font-serif whitespace-pre-line">
              {pages[currentPage - 1] || ''}
            </Typography>
          </div>

          {/* Navigation Bar */}
          <div className="border-t border-amber-100 bg-amber-50">
            <div className="flex justify-center items-center gap-4 p-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 && !hasPreviousChapter}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <Typography variant="body-sm" color="secondary">
                Page {currentPage} of {totalPages}
              </Typography>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages && !hasNextChapter}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookViewer;