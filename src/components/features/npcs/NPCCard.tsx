import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NPC } from '../../../types/npc';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import { useQuests } from '../../../hooks/useQuests';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin,
  Users,
  Scroll,
  Calendar,
  Heart
} from 'lucide-react';

interface NPCCardProps {
  npc: NPC;
}

const NPCCard: React.FC<NPCCardProps> = ({ npc }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { getQuestById } = useQuests();

  // Function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'alive':
        return 'text-green-500';
      case 'deceased':
        return 'text-red-500';
      case 'missing':
        return 'text-yellow-500';
      case 'unknown':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Function to get relationship color
  const getRelationshipColor = (relationship: string): string => {
    switch (relationship) {
      case 'friendly':
        return 'text-green-500';
      case 'hostile':
        return 'text-red-500';
      case 'neutral':
        return 'text-gray-500';
      case 'unknown':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Function to handle location click
  const handleLocationClick = (location: string) => {
    navigate(`/locations?highlight=${encodeURIComponent(location)}`);
  };

  const handleQuestClick = (questId: string) => {
    navigate(`/quests?highlight=${encodeURIComponent(questId)}`);
  };

  return (
    <Card>
      <Card.Content className="space-y-4">
        {/* NPC Header */}
        <div className="flex-1">
          <Typography variant="h4">
            {npc.name}
          </Typography>
          {npc.title && (
            <Typography color="secondary" className="mt-1">
              {npc.title}
            </Typography>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-3">
          {/* Status and Relationship */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Typography variant="body-sm" className="font-medium">
                Status:
              </Typography>
              <Typography variant="body-sm" className={`font-medium ${getStatusColor(npc.status)}`}>
                {npc.status.charAt(0).toUpperCase() + npc.status.slice(1)}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Typography variant="body-sm" className="font-medium">
                Relationship:
              </Typography>
              <Typography variant="body-sm" className={`font-medium ${getRelationshipColor(npc.relationship)}`}>
                {npc.relationship.charAt(0).toUpperCase() + npc.relationship.slice(1)}
              </Typography>
            </div>
          </div>

          {/* Location and Occupation */}
          {(npc.location || npc.occupation) && (
            <div className="space-y-2">
              {npc.occupation && (
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-gray-400" />
                  <Typography variant="body-sm">
                    {npc.occupation}
                  </Typography>
                </div>
              )}
              {npc.location && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLocationClick(npc.location!)}
                  className="flex items-center gap-2 w-full justify-start"
                >
                  <MapPin size={16} className="text-gray-400" />
                  <Typography variant="body-sm">
                    {npc.location}
                  </Typography>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Additional Details */}
            {(npc.description || npc.appearance || npc.personality || npc.background) && (
              <div className="space-y-3">
                {npc.description && (
                  <div>
                  <Typography variant="body-sm" className="font-medium">
                    Description
                  </Typography>
                  <Typography variant="body-sm" color="secondary">
                    {npc.description}
                  </Typography>
                  </div>
                )}
                {npc.appearance && (
                  <div>
                    <Typography variant="body-sm" className="font-medium">
                      Appearance
                    </Typography>
                    <Typography variant="body-sm" color="secondary">
                      {npc.appearance}
                    </Typography>
                  </div>
                )}
                {npc.personality && (
                  <div>
                    <Typography variant="body-sm" className="font-medium">
                      Personality
                    </Typography>
                    <Typography variant="body-sm" color="secondary">
                      {npc.personality}
                    </Typography>
                  </div>
                )}
                {npc.background && (
                  <div>
                    <Typography variant="body-sm" className="font-medium">
                      Background
                    </Typography>
                    <Typography variant="body-sm" color="secondary">
                      {npc.background}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* Related Quests */}
            {npc.connections.relatedQuests.length > 0 && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Related Quests
                </Typography>
                <div className="space-y-2">
                  {npc.connections.relatedQuests.map((questId) => {
                    const quest = getQuestById(questId);
                    return quest ? (
                      <Button
                        key={questId}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuestClick(questId)}
                        className="w-full"
                        centered={false}
                      >
                        <div className="flex items-start gap-2 text-left">
                          <Scroll 
                            size={16} 
                            className={`mt-1 ${
                              quest.status === 'completed' ? 'text-green-500' :
                              quest.status === 'failed' ? 'text-red-500' :
                              'text-blue-500'
                            }`}
                          />
                          <div className="flex-1">
                            <Typography variant="body-sm" className="font-medium">
                              {quest.title}
                            </Typography>
                            <Typography variant="body-sm" color="secondary">
                              Status: {quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
                            </Typography>
                          </div>
                        </div>
                      </Button>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            {npc.notes.length > 0 && (
              <div className="space-y-2">
                <Typography variant="body-sm" className="font-medium">
                  Notes
                </Typography>
                {npc.notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <Typography variant="body-sm" color="secondary">
                        {note.date}
                      </Typography>
                    </div>
                    <Typography variant="body-sm">
                      {note.text}
                    </Typography>
                  </div>
                ))}
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

export default NPCCard;