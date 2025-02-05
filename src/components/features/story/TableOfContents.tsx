// features/story/TableOfContents.tsx
import React, { useState } from 'react';
import { Chapter } from '../../../types/story';
import Typography from '../../core/Typography';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface TableOfContentsProps {
  /** Array of all chapters */
  chapters: Chapter[];
  /** Currently selected chapter ID */
  currentChapterId?: string;
  /** Callback when a chapter is selected */
  onChapterSelect: (chapterId: string) => void;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * TableOfContents component displays a hierarchical list of chapters
 * with support for collapsible sections and keyboard navigation
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  currentChapterId,
  onChapterSelect,
  className
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, chapterId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChapterSelect(chapterId);
    }
  };

  // Group chapters by major sections (e.g., "Chapter 1", "Chapter 2", etc.)
  const groupedChapters = chapters.reduce((acc, chapter) => {
    const sectionMatch = chapter.title.match(/Chapter \d+/i);
    const section = sectionMatch ? sectionMatch[0] : 'Other';
    
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  return (
    <nav 
      className={clsx('w-full max-w-xs', className)}
      aria-label="Table of contents"
    >
      <Typography variant="h3" className="mb-4">
        Table of Contents
      </Typography>

      <div className="space-y-2">
        {Object.entries(groupedChapters).map(([section, sectionChapters]) => {
          const isExpanded = expandedSections.has(section);
          
          return (
            <div key={section} className="border-l-2 border-gray-200">
              {/* Section Header */}
              <button
                className={clsx(
                  'flex items-center w-full p-2 hover:bg-gray-50',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}
                onClick={() => toggleSection(section)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <Typography variant="h4" className="ml-2">
                  {section}
                </Typography>
              </button>

              {/* Chapter List */}
              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {sectionChapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      className={clsx(
                        'w-full text-left p-2 rounded',
                        'hover:bg-gray-50 focus:outline-none focus:ring-2',
                        'focus:ring-offset-2 focus:ring-blue-500',
                        currentChapterId === chapter.id && 'bg-blue-50 text-blue-600'
                      )}
                      onClick={() => onChapterSelect(chapter.id)}
                      onKeyDown={(e) => handleKeyDown(e, chapter.id)}
                      aria-current={currentChapterId === chapter.id ? 'page' : undefined}
                    >
                      <Typography 
                        variant="body-sm"
                        color={currentChapterId === chapter.id ? 'primary' : 'default'}
                      >
                        {chapter.title}
                      </Typography>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default TableOfContents;