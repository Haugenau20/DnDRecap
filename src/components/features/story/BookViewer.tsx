import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useNavigation } from '../../../hooks/useNavigation';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';

interface BookViewerProps {
  content: string;
  title: string;
  onPageChange?: (page: number, isComplete?: boolean) => void;
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

  // Split content into pages
  useEffect(() => {
    const wordsPerPage = 250;
    const words = content.split(' ');
    const pageArray = [];
    
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pageArray.push(words.slice(i, i + wordsPerPage).join(' '));
    }
    
    setPages(pageArray);
    setTotalPages(pageArray.length);
    setCurrentPage(1); // Reset to first page when content changes
  }, [content]);

  // Handle page navigation
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
      
      // Mark as complete if we're on the last page
      const isComplete = newPage === totalPages;
      if (isComplete) {
        onPageChange?.(newPage, true);
      }
    } else if (newPage > totalPages && hasNextChapter) {
      // Mark current chapter as complete before moving to next
      onPageChange?.(totalPages, true);
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
          {/* Content Container */}
          <div className="max-w-2xl mx-auto p-8 pb-20">
            <Typography className="leading-relaxed font-serif whitespace-pre-line">
              {pages[currentPage - 1]}
            </Typography>
          </div>

          {/* Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-100">
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