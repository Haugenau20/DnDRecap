import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ScrollText, Bookmark, Clock, ListRestart } from 'lucide-react';
import Typography from '../../core/Typography';
import { useStory } from '../../../context/StoryContext';

const StorySidebar = () => {
  const navigate = useNavigate();
  const { chapters, storyProgress } = useStory();
  
  // Calculate reading progress based on chapters that have been accessed
  const readingProgress = useMemo(() => {
    const readChapters = chapters.filter(chapter => {
      // Consider a chapter as read if it exists in the progress or if it's the current chapter
      return chapter.id === storyProgress.currentChapter || 
             storyProgress.chapterProgress[chapter.id] !== undefined;
    });

    return {
      count: readChapters.length,
      percentage: (readChapters.length / chapters.length) * 100
    };
  }, [chapters, storyProgress]);

  // Get recently read chapters
  const recentChapters = useMemo(() => {
    const chaptersWithDates = chapters
      .filter(chapter => {
        const progress = storyProgress.chapterProgress[chapter.id];
        return progress?.lastRead || chapter.id === storyProgress.currentChapter;
      })
      .map(chapter => ({
        ...chapter,
        lastRead: storyProgress.chapterProgress[chapter.id]?.lastRead || 
                 (chapter.id === storyProgress.currentChapter ? storyProgress.lastRead : new Date(0))
      }))
      .sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())
      .slice(0, 3);

    return chaptersWithDates;
  }, [chapters, storyProgress]);

  // Navigation handlers
  const handleContinueReading = () => {
    if (storyProgress.currentChapter) {
      navigate(`/story/chronicles/${storyProgress.currentChapter}`);
    } else {
      // If no current chapter, start with the first unread chapter
      const firstUnreadChapter = chapters.find(chapter => 
        !storyProgress.chapterProgress[chapter.id]
      );
      if (firstUnreadChapter) {
        navigate(`/story/chronicles/${firstUnreadChapter.id}`);
      } else {
        // If all chapters are read, go to the first chapter
        navigate(`/story/chronicles/${chapters[0].id}`);
      }
    }
  };

  const handleChapterClick = (chapterId: string) => {
    navigate(`/story/chronicles/${chapterId}`);
  };

  const handleBookmarksClick = () => {
    // This could be implemented later when bookmark functionality is added
    console.log('Bookmarks feature coming soon');
  };

  return (
    <div className="space-y-6 p-4">
      {/* Reading Progress */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Book className="w-5 h-5 text-blue-500" />
          <Typography variant="h4">Reading Progress</Typography>
        </div>
        <div className="bg-gray-100 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 rounded-full h-2 transition-all"
            style={{ width: `${readingProgress.percentage}%` }}
          />
        </div>
        <Typography variant="body-sm" color="secondary">
          {readingProgress.count} of {chapters.length} chapters read
        </Typography>
      </div>

      {/* Recently Read */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-blue-500" />
          <Typography variant="h4">Recently Read</Typography>
        </div>
        <div className="space-y-2">
          {recentChapters.map(chapter => (
            <button
              key={chapter.id}
              onClick={() => handleChapterClick(chapter.id)}
              className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
            >
              <Typography variant="body-sm" className="font-medium">
                Chapter {chapter.order}
              </Typography>
              <Typography variant="body-sm" color="secondary" className="truncate">
                {chapter.title}
              </Typography>
            </button>
          ))}
          {recentChapters.length === 0 && (
            <Typography variant="body-sm" color="secondary" className="text-center p-2">
              No chapters read yet
            </Typography>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ListRestart className="w-5 h-5 text-blue-500" />
          <Typography variant="h4">Quick Actions</Typography>
        </div>
        <div className="space-y-2">
          <button 
            onClick={handleContinueReading}
            className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <ScrollText className="w-4 h-4" />
            <Typography variant="body-sm">Continue Reading</Typography>
          </button>
          <button 
            onClick={handleBookmarksClick}
            className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            <Typography variant="body-sm">Bookmarks</Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorySidebar;