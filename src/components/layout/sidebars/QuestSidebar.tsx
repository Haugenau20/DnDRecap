import React, { useMemo } from 'react';
import { useQuests } from '../../../hooks/useQuests';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import { MapPin, ChevronRight } from 'lucide-react';
import { useNavigation } from '../../../context/NavigationContext';

const QuestSidebar = () => {
  const { quests } = useQuests();
  const { navigateToPage, createPath } = useNavigation();

  // Group quests by location
  const questsByLocation = useMemo(() => {
    return quests.reduce((acc, quest) => {
      if (quest.location) {
        if (!acc[quest.location]) {
          acc[quest.location] = [];
        }
        acc[quest.location].push(quest);
      }
      return acc;
    }, {} as Record<string, typeof quests>);
  }, [quests]);

  return (
    <div className="p-4">
      {/* Quests by Location */}
      <Card>
        <Card.Content className="space-y-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Quests by Location
          </Typography>

          <div className="space-y-4">
            {Object.entries(questsByLocation).map(([location, locationQuests]) => (
              <div key={location} className="space-y-1">
                <Typography variant="body" color="secondary" className="font-medium">
                  {location}
                </Typography>
                {locationQuests.map(quest => (
                  <Button
                    key={quest.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToPage(createPath('/quests', {}, { highlight: quest.id}))}
                    className="w-full pl-4"
                    centered={false}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <Typography 
                        variant="body-sm" 
                        className="truncate max-w-[140px]"
                        title={quest.title} // Shows full title on hover
                      >
                        {quest.title}
                      </Typography>
                    </div>
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default QuestSidebar;