import React from 'react';
import { useLocation } from 'react-router-dom';
import { Book, ScrollText, Bookmark, Clock, ListRestart } from 'lucide-react';
import Typography from '../../core/Typography';
import { useStory } from '../../../context/StoryContext';

const StorySidebar = () => {
  const { chapters, storyProgress } = useStory();
  
  // Get last 3 read chapters
  const recentChapters = chapters
    .filter(chapter => {
      const progress = storyProgress.chapterProgress[chapter.id];
      return progress && progress.lastRead;
    })
    .sort((a, b) => {
      const aDate = new Date(storyProgress.chapterProgress[a.id].lastRead);
      const bDate = new Date(storyProgress.chapterProgress[b.id].lastRead);
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 3);

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
            style={{ 
              width: `${(Object.keys(storyProgress.chapterProgress).length / chapters.length) * 100}%` 
            }}
          />
        </div>
        <Typography variant="body-sm" color="secondary">
          {Object.keys(storyProgress.chapterProgress).length} of {chapters.length} chapters read
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
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ListRestart className="w-5 h-5 text-blue-500" />
          <Typography variant="h4">Quick Actions</Typography>
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors">
            <ScrollText className="w-4 h-4" />
            <Typography variant="body-sm">Continue Reading</Typography>
          </button>
          <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors">
            <Bookmark className="w-4 h-4" />
            <Typography variant="body-sm">Bookmarks</Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorySidebar;