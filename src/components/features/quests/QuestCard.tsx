import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quest } from '../../../types/quest';
import { useNPCs } from '../../../context/NPCContext';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin,
  Users,
  Scroll,
  Calendar,
  Target,
  AlertCircle,
  Heart,
  Shield,
  SwordIcon,
  HelpCircle
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
}



const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { getNPCById } = useNPCs();

  // Calculate completion percentage
  const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
  const completionPercentage = Math.round(
    (completedObjectives / quest.objectives.length) * 100
  );

  return (
    <Card>
      <Card.Content className="space-y-4">
        {/* Quest Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Typography variant="h3">
                {quest.title}
              </Typography>
              <span className={`px-2 py-1 rounded-full text-sm ${
                quest.status === 'completed' ? 'bg-green-100 text-green-800' :
                quest.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
              </span>
            </div>
            <Typography color="secondary" className="mt-1">
              {quest.description}
            </Typography>
          </div>
        </div>

        {/* Quest Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quest.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <Typography color="secondary">Location: {quest.location}</Typography>
            </div>
          )}
          {quest.levelRange && (
            <div className="flex items-center gap-2">
              <Target size={16} className="text-gray-500" />
              <Typography color="secondary">Level: {quest.levelRange}</Typography>
            </div>
          )}
          {quest.dateAdded && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <Typography color="secondary">Added: {quest.dateAdded}</Typography>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pt-4 space-y-6">
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
                    <div className={`w-4 h-4 rounded border ${
                      objective.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`} />
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
                  {quest.keyLocations.map((location, index) => (
                    <div key={index}>
                      <Typography variant="body" className="font-medium">
                        {location.name}
                      </Typography>
                      <Typography color="secondary">
                        {location.description}
                      </Typography>
                    </div>
                  ))}
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
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/npcs?highlight=${npcId}`)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start gap-2">
                            <Users 
                              size={16} 
                              className={
                                npc.relationship === 'friendly' ? 'text-green-500' :
                                npc.relationship === 'hostile' ? 'text-red-500' :
                                npc.relationship === 'neutral' ? 'text-yellow-500' :
                                'text-gray-400'
                              } 
                            />
                            <div>
                              <Typography variant="body-sm" className="font-medium">
                                {npc.name}
                                {npc.title && (
                                  <span className="text-gray-500 ml-1">
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
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
          startIcon={isExpanded ? <ChevronUp /> : <ChevronDown />}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </Card.Content>
    </Card>
  );
};

export default QuestCard;