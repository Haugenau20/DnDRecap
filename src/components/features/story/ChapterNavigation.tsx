// features/story/ChapterNavigation.tsx
import React, { useState } from 'react';
import { Chapter } from '../../../types/story';
import Typography from '../../core/Typography';
import Button from '../../core/Button';
import Card from '../../core/Card';
import TableOfContents from './TableOfContents';
import { Menu, Book, BookOpen, ArrowUpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ChapterNavigationProps {
  /** Array of all chapters */
  chapters: Chapter[];
  /** Currently selected chapter ID */
  currentChapterId?: string;
  /** Callback when a chapter is selected */
  onChapterSelect: (chapterId: string) => void;
  /** Current reading progress (0-100) */
  progress: number;
  /** Optional className for styling */
  className?: string;
}

/**
 * ChapterNavigation component provides a comprehensive navigation interface
 * including quick chapter selection, table of contents, and progress tracking
 */
const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  currentChapterId,
  onChapterSelect,
  progress,
  className
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentChapter = chapters.find(chapter => chapter.id === currentChapterId);

  // Get the next and previous chapters
  const currentIndex = currentChapter ? chapters.findIndex(c => c.id === currentChapter.id) : -1;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Jump to the next unread chapter
  const jumpToNextUnread = () => {
    const nextUnread = chapters.find(chapter => {
      // In a real implementation, you would check against user's reading progress
      return chapter.order > (currentChapter?.order || 0);
    });

    if (nextUnread) {
      onChapterSelect(nextUnread.id);
    }
  };

  // Toggle the navigation drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Quick Navigation Bar */}
      <Card className="mb-4">
        <Card.Content className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            onClick={toggleDrawer}
            startIcon={<Menu />}
          >
            Chapters
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {currentChapter ? `Chapter ${currentChapter.order} of ${chapters.length}` : 'Select a chapter'}
            </div>

            <div className="hidden md:block w-48">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={jumpToNextUnread}
            startIcon={<ArrowUpCircle />}
            disabled={!nextChapter}
          >
            Next Unread
          </Button>
        </Card.Content>
      </Card>

      {/* Navigation Drawer */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg',
          'transform transition-transform duration-300 ease-in-out',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Typography variant="h3">
                Chapters
              </Typography>
              <Button
                variant="ghost"
                onClick={toggleDrawer}
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <TableOfContents
              chapters={chapters}
              currentChapterId={currentChapterId}
              onChapterSelect={(chapterId) => {
                onChapterSelect(chapterId);
                setIsDrawerOpen(false);
              }}
            />
          </div>

          {/* Quick Navigation Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-between space-x-4">
              <Button
                variant="outline"
                onClick={() => prevChapter && onChapterSelect(prevChapter.id)}
                disabled={!prevChapter}
                className="flex-1"
                startIcon={<Book />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => nextChapter && onChapterSelect(nextChapter.id)}
                disabled={!nextChapter}
                className="flex-1"
                endIcon={<BookOpen />}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        />
      )}
    </div>
  );
};

export default ChapterNavigation;