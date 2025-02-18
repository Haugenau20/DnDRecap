// pages/story/index.tsx
import Typography from '../../components/core/Typography';
import Card from '../../components/core/Card';
import { useNavigation } from '../../context/NavigationContext';
import { ScrollText, BookOpen } from 'lucide-react';

const StorySelection = () => {
  const { navigateToPage } = useNavigation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <Typography variant="h1" className="mb-4">
          Campaign Chronicles
        </Typography>
        <Typography variant="body-lg" color="secondary" className="mb-8">
          Choose how you want to experience your campaign's story
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Session Chronicles Card */}
        <Card
          hoverable
          onClick={() => navigateToPage('/story/chronicles')}
          className="text-center p-8 cursor-pointer transition-transform hover:scale-105"
        >
          <Card.Content>
            <div className="flex flex-col items-center">
              <ScrollText className="w-24 h-24 text-blue-600 mb-6" />
              <Typography variant="h2" className="mb-4">
                Session Chronicles
              </Typography>
              <Typography color="secondary">
                Relive your adventures as they happened, session by session.
                Explore detailed accounts of each game session with all actions
                and events preserved.
              </Typography>
            </div>
          </Card.Content>
        </Card>

        {/* Campaign Saga Card */}
        <Card
          hoverable
          onClick={() => navigateToPage('/story/saga')}
          className="text-center p-8 cursor-pointer transition-transform hover:scale-105"
        >
          <Card.Content>
            <div className="flex flex-col items-center">
              <BookOpen className="w-24 h-24 text-purple-600 mb-6" />
              <Typography variant="h2" className="mb-4">
                Campaign Saga
              </Typography>
              <Typography color="secondary">
                Experience your campaign as one continuous epic tale.
                A seamlessly woven narrative of your party's complete adventure.
              </Typography>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default StorySelection;