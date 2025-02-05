// pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import Button from '../components/core/Button';
import { SearchBar } from '../components/shared/SearchBar';
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
  const navigate = useNavigate();

  // Quick access section items
  const quickAccessItems: QuickAccessItem[] = [
    {
      title: 'Campaign Story',
      description: 'Follow your epic journey chapter by chapter',
      icon: <Book className="w-6 h-6" />,
      path: '/story'
    },
    {
      title: 'Active Quests',
      description: 'Track your ongoing adventures and rewards',
      icon: <Scroll className="w-6 h-6" />,
      path: '/quests'
    },
    {
      title: 'NPC Directory',
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
        
        {/* Prominent Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
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
              onClick={() => navigate(item.path)}
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
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {/* Placeholder for recent activity items */}
          <Card>
            <Card.Content>
              <Typography color="secondary">
                Campaign session logs and recent updates will appear here
              </Typography>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;