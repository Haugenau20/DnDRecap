import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NPC } from '../../../types/npc';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import { 
  User, 
  MapPin, 
  Crown, 
  Scroll,
  Users,
  ChevronDown,
  ChevronUp,
  CalendarDays
} from 'lucide-react';

interface NPCCardProps {
  npc: NPC;
}

const NPCCard: React.FC<NPCCardProps> = ({ npc }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Function to get relationship color
  const getRelationshipColor = (relationship: string): string => {
    switch (relationship) {
      case 'friendly':
        return 'text-green-500';
      case 'hostile':
        return 'text-red-500';
      case 'neutral':
        return 'text-gray-500';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <Card>
      <Card.Content className="space-y-4">
        {/* NPC Header */}
        <div className="flex items-start gap-3">
          <User className={`mt-1 ${getRelationshipColor(npc.relationship)}`} size={24} />
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
        </div>

        {/* Basic Info */}
        <div className="space-y-3">
          {/* Status and Relationship */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Typography variant="body-sm" className="font-medium">
                Status:
              </Typography>
              <Typography variant="body-sm" color="secondary">
                {npc.status.charAt(0).toUpperCase() + npc.status.slice(1)}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Typography variant="body-sm" className="font-medium">
                Relationship:
              </Typography>
              <Typography variant="body-sm" color="secondary">
                {npc.relationship.charAt(0).toUpperCase() + npc.relationship.slice(1)}
              </Typography>
            </div>
          </div>

          {/* Location and Occupation */}
          {(npc.location || npc.occupation) && (
            <div className="space-y-2">
              {npc.occupation && (
                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-gray-400" />
                  <Typography variant="body-sm">
                    {npc.occupation}
                  </Typography>
                </div>
              )}
              {npc.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Typography variant="body-sm">
                    {npc.location}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <Typography color="secondary" className="text-sm">
            {npc.description}
          </Typography>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Additional Details */}
            {(npc.appearance || npc.personality || npc.background) && (
              <div className="space-y-3">
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

            {/* Connections */}
            <div className="space-y-3">
              {/* Related NPCs */}
              {npc.connections.relatedNPCs.length > 0 && (
                <div>
                  <Typography variant="body-sm" className="font-medium mb-2">
                    Related NPCs
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {npc.connections.relatedNPCs.map((relatedNPC) => (
                      <div
                        key={relatedNPC}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {relatedNPC}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affiliations */}
              {npc.connections.affiliations.length > 0 && (
                <div>
                  <Typography variant="body-sm" className="font-medium mb-2">
                    Affiliations
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {npc.connections.affiliations.map((affiliation) => (
                      <div
                        key={affiliation}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {affiliation}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Quests */}
              {npc.connections.relatedQuests.length > 0 && (
                <div>
                  <Typography variant="body-sm" className="font-medium mb-2">
                    Related Quests
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {npc.connections.relatedQuests.map((questId) => (
                      <Button
                        key={questId}
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/quests?highlight=${questId}`)}
                        startIcon={<Scroll size={14} />}
                      >
                        {questId}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                      <CalendarDays size={14} className="text-gray-400" />
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