import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuests } from '../../../hooks/useQuests';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import { 
  Scroll, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Calendar,
  MapPin,
  Users,
  ChevronRight
} from 'lucide-react';

const QuestSidebar = () => {
  const navigate = useNavigate();
  const { quests } = useQuests();

  // Calculate quest statistics
  const stats = useMemo(() => {
    const active = quests.filter(q => q.status === 'active').length;
    const completed = quests.filter(q => q.status === 'completed').length;
    const failed = quests.filter(q => q.status === 'failed').length;
    
    return { active, completed, failed };
  }, [quests]);

  // Get recently updated quests
  const recentQuests = useMemo(() => {
    return [...quests]
      .sort((a, b) => {
        const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
        const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);
  }, [quests]);

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
    <div className="p-4 space-y-6">
      {/* Quest Statistics */}
      <Card>
        <Card.Content className="space-y-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-blue-500" />
            Quest Overview
          </Typography>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Typography variant="body-sm" color="secondary">Active</Typography>
              <Typography variant="h3" className="text-blue-500">{stats.active}</Typography>
            </div>
            <div>
              <Typography variant="body-sm" color="secondary">Completed</Typography>
              <Typography variant="h3" className="text-green-500">{stats.completed}</Typography>
            </div>
            <div>
              <Typography variant="body-sm" color="secondary">Failed</Typography>
              <Typography variant="h3" className="text-red-500">{stats.failed}</Typography>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Recent Quests */}
      <Card>
        <Card.Content className="space-y-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Recent Quests
          </Typography>

          <div className="space-y-2">
            {recentQuests.map(quest => (
              <Button
                key={quest.id}
                variant="ghost"
                onClick={() => navigate(`/quests?highlight=${quest.id}`)}
                className="w-full"
                centered={false}
              >
                <div className="flex items-center gap-2 w-full">
                  {quest.status === 'active' && <AlertCircle className="w-4 h-4 text-blue-500" />}
                  {quest.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {quest.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  <div className="flex-1 text-left">
                    <Typography variant="body-sm" className="font-medium truncate">
                      {quest.title}
                    </Typography>
                    {quest.dateAdded && (
                      <Typography variant="body-sm" color="secondary">
                        Added: {new Date(quest.dateAdded).toLocaleDateString()}
                      </Typography>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Quests by Location */}
      <Card>
        <Card.Content className="space-y-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Quests by Location
          </Typography>

          <div className="space-y-2">
            {Object.entries(questsByLocation).map(([location, locationQuests]) => (
              <div key={location} className="space-y-1">
                <Typography variant="body-sm" color="secondary" className="font-medium">
                  {location}
                </Typography>
                {locationQuests.map(quest => (
                  <Button
                    key={quest.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/quests?highlight=${quest.id}`)}
                    className="w-full pl-4"
                    centered={false}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <Typography variant="body-sm" className="truncate">
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

      {/* Quest Deadlines & Calendar Integration Could Be Added Here */}
    </div>
  );
};

export default QuestSidebar;