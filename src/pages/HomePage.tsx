// pages/HomePage.tsx
import React, { useMemo } from 'react';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import LatestChapter from '../components/features/story/LatestChapter';
import { useChapterData } from '../hooks/useChapterData';
import { useNavigation } from '../context/NavigationContext';
import { Book, Scroll, Users, MapPin } from 'lucide-react';

/**
 * Interface for quick access section items
 */
interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

/**
 * HomePage component serving as the main landing page of the application
 */
const HomePage: React.FC = () => {
  const { chapters, loading, error } = useChapterData();
  const { navigateToPage } = useNavigation();

  // Get the latest chapter from the fetched data
  const latestChapter = useMemo(() => {
    if (!chapters || chapters.length === 0) return null;
    
    // Sort chapters by order and get the latest one
    const sortedChapters = [...chapters].sort((a, b) => b.order - a.order);
    const latest = sortedChapters[0];
    
    if (!latest) return null;

    // Convert the chapter data to match LatestChapter's expected type
    return {
      ...latest,
      lastModified: latest.lastModified 
        ? new Date(latest.lastModified).toISOString() 
        : new Date().toISOString()
    };
  }, [chapters]);

  // Quick access section items
  const quickAccessItems: QuickAccessItem[] = [
    {
      title: 'Story',
      description: 'Follow your epic journey chapter by chapter',
      icon: <Book className="w-6 h-6" />,
      path: '/story'
    },
    {
      title: 'Quests',
      description: 'Track your ongoing adventures and rewards',
      icon: <Scroll className="w-6 h-6" />,
      path: '/quests'
    },
    {
      title: 'NPCs',
      description: 'Keep track of friends, foes, and everyone in between',
      icon: <Users className="w-6 h-6" />,
      path: '/npcs'
    },
    {
      title: 'Locations',
      description: 'Explore the world and its many destinations',
      icon: <MapPin className="w-6 h-6" />,
      path: '/locations'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <Typography variant="h1" className="mb-4">
          D&D Campaign Companion
        </Typography>
        <Typography variant="body-lg" color="secondary" className="mb-8">
          Your digital guide through epic adventures
        </Typography>
      </section>

      {/* Quick Access Section */}
      <section className="mb-12">
        <Typography variant="h2" className="mb-6">
          Quick Access
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccessItems.map((item) => (
            <Card
              key={item.path}
              hoverable
              onClick={() => navigateToPage(item.path)}
              className="h-full"
            >
              <Card.Content className="flex flex-col items-center text-center p-6">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  {item.icon}
                </div>
                <Typography variant="h4" className="mb-2">
                  {item.title}
                </Typography>
                <Typography color="secondary">
                  {item.description}
                </Typography>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h2">
            Recent Activity
          </Typography>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Card>
              <Card.Content className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <Typography variant="h3" className="mb-2">
                  Loading Recent Activity
                </Typography>
              </Card.Content>
            </Card>
          ) : error ? (
            <Card>
              <Card.Content className="text-center py-8">
                <Typography color="error" className="mb-2">
                  {error}
                </Typography>
              </Card.Content>
            </Card>
          ) : latestChapter ? (
            <LatestChapter chapter={latestChapter} />
          ) : (
            <Card>
              <Card.Content className="text-center py-8">
                <Book className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <Typography variant="h3" className="mb-2">
                  No Chapters Available
                </Typography>
                <Typography color="secondary">
                  Start your adventure by adding your first chapter.
                </Typography>
              </Card.Content>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;