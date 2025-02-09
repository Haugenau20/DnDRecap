import { Chapter } from '../../../types/story';
import Typography from '../../core/Typography';
import Button from '../../core/Button';
import { Book, X } from 'lucide-react';

interface SlidingChaptersProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onChapterSelect: (chapterId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SlidingChapters: React.FC<SlidingChaptersProps> = ({
  chapters,
  currentChapterId,
  onChapterSelect,
  isOpen,
  onClose,
}) => {

  const handleChapterClick = (chapterId: string) => {
    onChapterSelect(chapterId);
    onClose();
  };

  return (
    <>
      {/* Toggle Button moved to parent component */}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              <Typography variant="h3">Chapters</Typography>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chapter List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    chapter.id === currentChapterId
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Typography variant="body" className="font-medium">
                    {chapter.order}. {chapter.title}
                  </Typography>
                  {chapter.summary && (
                    <Typography
                      variant="body-sm"
                      color="secondary"
                      className="mt-1 line-clamp-2"
                    >
                      {chapter.summary}
                    </Typography>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlidingChapters;