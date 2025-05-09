import React, { useState } from 'react';
import { Quest } from '../../../types/quest';
import { useNPCs } from '../../../context/NPCContext';
import { useFirebase } from '../../../context/FirebaseContext';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import { useLocations } from '../../../context/LocationContext';
import { useNavigation } from '../../../context/NavigationContext';
import { useTheme } from '../../../context/ThemeContext';
import clsx from 'clsx';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin,
  Users,
  Calendar,
  Target,
  Edit,
  Scroll
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getNPCById } = useNPCs();
  const { locations } = useLocations();
  const { user } = useFirebase();
  const { navigateToPage, createPath } = useNavigation();
  const { theme } = useTheme();
  const themePrefix = theme.name;

  // Calculate completion percentage
  const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
  const completionPercentage = Math.round(
    (completedObjectives / quest.objectives.length) * 100
  );

  // Add a helper function to check if a location exists:
  const locationExists = (locationName: string): boolean => {
    return locations.some(loc => 
      loc.name.toLowerCase() === locationName.toLowerCase()
    );
  };

  return (
    <Card className={clsx(
      `${themePrefix}-quest-card`,
      `${themePrefix}-quest-card-${quest.status}`
      
      )}>
      <Card.Content className="space-y-4">
        {/* Quest Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-between">
              <Typography variant="h3">
                {quest.title}
              </Typography>

              {/* Expand/Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2"
                startIcon={isExpanded ? <ChevronUp /> : <ChevronDown />}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>

            </div>
            <Typography color="secondary" className="mt-1">
              {quest.description}
            </Typography>
          </div>
        </div>

        {/* Quest Metadata */}
        <div className="flex gap-6">
          {quest.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className={`${themePrefix}-typography-secondary`} />
              {locationExists(quest.location) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (quest.location) {
                      navigateToPage(createPath('/locations', {}, { highlight: quest.location }));
                    }
                  }}
                  className="p-0 hover:underline"
                >
                  <Typography color="secondary">
                    Location: {quest.location}
                  </Typography>
                </Button>
              ) : (
                <Typography color="secondary">
                  Location: {quest.location}
                </Typography>
              )}
            </div>
          )}
          {quest.levelRange && (
            <div className="flex items-center gap-2">
              <Target size={16} className={`${themePrefix}-typography-secondary`} />
              <Typography color="secondary">Level: {quest.levelRange}</Typography>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className={clsx("w-full rounded-full h-2", `${themePrefix}-progress-container`)}>
          <div 
            className={clsx(
              "rounded-full h-2 transition-all duration-300",
              `${themePrefix}-progress-bar-${quest.status}`
            )}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pt-4 space-y-6">
            {/* Creator attribution */}
            {quest.createdByUsername && (
              <div className="flex items-center gap-2 mt-1">
                <Scroll size={14} className={`${themePrefix}-typography-secondary`} />
                <Typography variant="body-sm" color="secondary">
                  Added by {quest.createdByUsername} on {new Date(quest.dateAdded || '').toLocaleDateString('en-uk')}
                </Typography>
              </div>
            )}

            {/* Modifier attribution - only show if different from creator or if modified later */}
            {quest.modifiedByUsername && quest.dateModified && 
              (quest.modifiedByUsername !== quest.createdByUsername || 
              new Date(quest.dateModified).getTime() > new Date(quest.dateAdded || '').getTime() + 1000) && (
              <div className="flex items-center gap-2 mt-1">
                <Edit size={14} className={`${themePrefix}-typography-secondary`} />
                <Typography variant="body-sm" color="secondary">
                  Modified by {quest.modifiedByUsername} on {new Date(quest.dateModified).toLocaleDateString('en-uk')}
                </Typography>
              </div>
            )}

            {/* Background */}
            {quest.background && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Background
                </Typography>
                <Typography color="secondary">
                  {quest.background}
                </Typography>
              </div>
            )}

            {/* Objectives */}
            <div>
              <Typography variant="h4" className="mb-2">
                Objectives
              </Typography>
              <div className="space-y-2">
                {quest.objectives.map(objective => (
                  <div 
                    key={objective.id}
                    className="flex items-center gap-2"
                  >
                    <div className={clsx(
                      `w-4 h-4 rounded border`,
                      objective.completed 
                        ? `${themePrefix}-objective-completed` 
                        : `${themePrefix}-objective-pending`
                    )} />
                    <Typography
                      color={objective.completed ? 'secondary' : 'default'}
                      className={objective.completed ? 'line-through' : ''}
                    >
                      {objective.description}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Initial Leads */}
            {quest.leads && quest.leads.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Initial Leads
                </Typography>
                <ul className="list-disc pl-5 space-y-1">
                  {quest.leads.map((lead, index) => (
                    <li key={index} className="pl-1">
                      <Typography color="secondary">{lead}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Locations */}
            {quest.keyLocations && quest.keyLocations.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Key Locations
                </Typography>
                <div className="space-y-3">
                  {quest.keyLocations.map((location, index) => {
                    const isClickable = locationExists(location.name);
                    
                    // If location exists in our data, make it a clickable button
                    if (isClickable) {
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (location.name) {
                              navigateToPage(createPath('/locations', {}, { highlight: location.name }));
                            }
                          }}
                          className="w-full"
                          centered={false}
                        >
                          <div className="flex items-start gap-2 text-left">
                            <MapPin 
                              size={16} 
                              className={`mt-1 ${themePrefix}-location-status-visited`}
                            />
                            <div className="flex-1">
                              <Typography variant="body-sm" className="font-medium">
                                {location.name}
                              </Typography>
                              <Typography variant="body-sm" color="secondary">
                                {location.description}
                              </Typography>
                            </div>
                          </div>
                        </Button>
                      );
                    }
                    
                    // If location doesn't exist in our data, render as non-clickable
                    return (
                      <div key={index} className="flex items-start gap-2 p-2">
                        <MapPin 
                          size={16} 
                          className={`mt-1 ${themePrefix}-typography-secondary`}
                        />
                        <div className="flex-1">
                          <Typography variant="body-sm" className="font-medium">
                            {location.name}
                          </Typography>
                          <Typography variant="body-sm" color="secondary">
                            {location.description}
                          </Typography>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NPCs */}
            <div className="space-y-4">
              {/* Important Quest NPCs */}
              {quest.importantNPCs && quest.importantNPCs.length > 0 && (
                <div>
                  <Typography variant="h4" className="mb-2">
                    Important NPCs
                  </Typography>
                  <div className="space-y-3">
                    {quest.importantNPCs.map((npc, index) => (
                      <div key={index}>
                        <Typography variant="body" className="font-medium">
                          {npc.name}
                        </Typography>
                        <Typography color="secondary">
                          {npc.description}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related NPCs from Directory */}
              {quest.relatedNPCIds && quest.relatedNPCIds.length > 0 && (
                <div>
                  <Typography variant="h4" className="mb-2">
                    Related NPCs
                  </Typography>
                  <div className="space-y-2">
                    {quest.relatedNPCIds.map((npcId) => {
                      const npc = getNPCById(npcId);
                      if (!npc) return null;
                      
                      return (
                        <Button
                          key={npcId}
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateToPage(createPath('/npcs', {}, { highlight: npcId }))}
                          className="w-full"
                          centered={false}
                        >
                          <div className="flex items-start gap-2 text-left">
                            <Users 
                              size={16} 
                              className={clsx(
                                "mt-1",
                                `${themePrefix}-npc-relationship-${npc.relationship}`
                              )}
                            />
                            <div className="flex-1">
                              <Typography variant="body-sm" className="font-medium">
                                {npc.name}
                                {npc.title && (
                                  <span className={`${themePrefix}-typography-secondary ml-1`}>
                                    - {npc.title}
                                  </span>
                                )}
                              </Typography>
                              {npc.location && (
                                <Typography variant="body-sm" color="secondary">
                                  {npc.location}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Complications */}
            {quest.complications && quest.complications.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Possible Complications
                </Typography>
                <ul className="list-disc pl-5 space-y-1">
                  {quest.complications.map((complication, index) => (
                    <li key={index} className="pl-1">
                      <Typography color="secondary">{complication}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rewards */}
            {quest.rewards && quest.rewards.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Rewards
                </Typography>
                <ul className="list-disc pl-5 space-y-1">
                  {quest.rewards.map((reward, index) => (
                    <li key={index} className="pl-1">
                      <Typography>{reward}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToPage(`/quests/edit/${quest.id}`)}
                startIcon={<Edit size={16} />}
              >
                Edit Quest
              </Button>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default QuestCard;