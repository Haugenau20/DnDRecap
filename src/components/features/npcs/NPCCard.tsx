import React from 'react';
import { NPC } from '../../../types/npc';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import { User, MapPin, Crown } from 'lucide-react';

interface NPCCardProps {
  npc: NPC;
}

const NPCCard: React.FC<NPCCardProps> = ({ npc }) => {
  // Function to get relationship color
  const getRelationshipColor = (relationship: string): string => {
    switch (relationship) {
      case 'friendly':
        return 'text-green-500';
      case 'hostile':
        return 'text-red-500';
      case 'neutral':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
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

        {/* NPC Details */}
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

          {/* Connections Summary */}
          {(npc.connections.affiliations.length > 0 || npc.connections.relatedQuests.length > 0) && (
            <div className="space-y-1 pt-2 border-t border-gray-100">
              {npc.connections.affiliations.length > 0 && (
                <Typography variant="body-sm" color="secondary">
                  Affiliations: {npc.connections.affiliations.join(', ')}
                </Typography>
              )}
              {npc.connections.relatedQuests.length > 0 && (
                <Typography variant="body-sm" color="secondary">
                  Related Quests: {npc.connections.relatedQuests.join(', ')}
                </Typography>
              )}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default NPCCard;