import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Typography from '../../core/Typography';
import Card from '../../core/Card';

interface BookViewerProps {
  content: string;
  title: string;
  onPageChange?: (page: number) => void;
  className?: string;
}

const BookViewer = ({ content, title, onPageChange, className }: BookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);

  // Split content into pages based on word count
  useEffect(() => {
    const wordsPerPage = 250; // Adjust based on testing
    const words = content.split(' ');
    const pageArray = [];
    
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pageArray.push(words.slice(i, i + wordsPerPage).join(' '));
    }
    
    setPages(pageArray);
    setTotalPages(pageArray.length);
  }, [content]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

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
      {/* Book Container */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Book Header */}
        <div className="bg-gray-50 border-b p-4">
          <Typography variant="h3" className="text-center">
            {title}
          </Typography>
        </div>

        {/* Book Content */}
        <div className="relative min-h-[600px] p-8 bg-[url('../../../../public/images/paper-texture.png')] bg-repeat">
          {/* Page Content */}
          <div className="max-w-2xl mx-auto">
            <Typography className="leading-relaxed font-serif">
              {pages[currentPage - 1]}
            </Typography>
          </div>

          {/* Page Navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
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

      {/* Page Corner Effect */}
      <div className="w-full max-w-4xl h-4 relative">
        <div className="absolute right-0 w-16 h-16 bg-gray-200 transform rotate-45 translate-y-[-50%] translate-x-[25%]" />
      </div>
    </div>
  );
};

export default BookViewer;