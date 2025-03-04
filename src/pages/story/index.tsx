// pages/story/index.tsx
import Typography from '../../components/core/Typography';
import Card from '../../components/core/Card';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { ScrollText, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const StorySelection = () => {
  const { navigateToPage } = useNavigation();
  const { theme } = useTheme();
  const themePrefix = theme.name;

  return (
    <div className={clsx("max-w-4xl mx-auto px-4 py-8", `${themePrefix}-content`)}>
      <div className="text-center mb-12">
        <Typography variant="h1" className={`mb-4 ${themePrefix}-typography-heading`}>
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
              <ScrollText className={clsx("w-24 h-24 mb-6", `text-${themePrefix}-primary`)} />
              <Typography variant="h2" className={`mb-4 ${themePrefix}-typography-heading`}>
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
              <BookOpen className={clsx("w-24 h-24 mb-6", `text-${themePrefix}-accent`)} />
              <Typography variant="h2" className={`mb-4 ${themePrefix}-typography-heading`}>
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