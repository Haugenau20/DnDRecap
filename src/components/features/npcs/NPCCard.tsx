import React, { useState } from 'react';
import { NPC, NPCNote } from '../../../types/npc';
import { useNPCs } from '../../../context/NPCContext';
import Card from '../../core/Card';
import Typography from '../../core/Typography';
import Button from '../../core/Button';
import Input from '../../core/Input';
import {
  User,
  MapPin,
  Crown,
  Shield,
  Heart,
  SwordIcon,
  HelpCircle,
  Skull,
  AlertCircle,
  CalendarDays,
  Users,
  Scroll,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';

interface NPCCardProps {
  npc: NPC;
  onUpdateRelationship?: (npcId: string, relationship: NPC['relationship']) => void;
}

const relationshipIcons = {
  friendly: <Heart className="text-green-500" />,
  neutral: <Shield className="text-gray-400" />,
  hostile: <SwordIcon className="text-red-500" />,
  unknown: <HelpCircle className="text-gray-400" />
};

const statusIcons = {
  active: <Shield className="text-green-500" />,
  deceased: <Skull className="text-gray-500" />,
  missing: <AlertCircle className="text-yellow-500" />,
  unknown: <HelpCircle className="text-gray-400" />
};

const NPCCard: React.FC<NPCCardProps> = ({ npc, onUpdateRelationship }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const { updateNPCNote } = useNPCs();

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: NPCNote = {
      date: new Date().toISOString().split('T')[0],
      text: newNote.trim()
    };

    updateNPCNote(npc.id, note);
    setNewNote('');
  };

  return (
    <Card>
      <Card.Content className="space-y-4">
        {/* NPC Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="text-gray-400" />
              <Typography variant="h3">
                {npc.name}
              </Typography>
              {statusIcons[npc.status]}
              {relationshipIcons[npc.relationship]}
            </div>
            {npc.title && (
              <Typography color="secondary" className="mt-1">
                {npc.title}
              </Typography>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {npc.occupation && (
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-gray-400" />
              <Typography>{npc.occupation}</Typography>
            </div>
          )}
          {npc.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <Typography>{npc.location}</Typography>
            </div>
          )}
        </div>

        {/* Description */}
        <Typography color="secondary">
          {npc.description}
        </Typography>

        {/* Relationship Controls */}
        <div className="flex flex-wrap gap-2">
          <Typography variant="body-sm" className="w-full">
            Relationship:
          </Typography>
          {(['friendly', 'neutral', 'hostile', 'unknown'] as const).map((relationship) => (
            <Button
              key={relationship}
              variant={npc.relationship === relationship ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onUpdateRelationship?.(npc.id, relationship)}
              startIcon={relationshipIcons[relationship]}
            >
              {relationship.charAt(0).toUpperCase() + relationship.slice(1)}
            </Button>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
          endIcon={isExpanded ? <ChevronUp /> : <ChevronDown />}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Connections */}
            {(npc.connections.relatedNPCs.length > 0 || 
              npc.connections.affiliations.length > 0 || 
              npc.connections.relatedQuests.length > 0) && (
              <div className="space-y-4">
                <Typography variant="h4">Connections</Typography>
                
                {npc.connections.relatedNPCs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-gray-400" />
                      <Typography variant="body-sm">Related NPCs:</Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {npc.connections.relatedNPCs.map((relatedNPC) => (
                        <Button
                          key={relatedNPC}
                          variant="outline"
                          size="sm"
                        >
                          {relatedNPC}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {npc.connections.affiliations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown size={16} className="text-gray-400" />
                      <Typography variant="body-sm">Affiliations:</Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {npc.connections.affiliations.map((affiliation) => (
                        <Button
                          key={affiliation}
                          variant="outline"
                          size="sm"
                        >
                          {affiliation}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {npc.connections.relatedQuests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Scroll size={16} className="text-gray-400" />
                      <Typography variant="body-sm">Related Quests:</Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {npc.connections.relatedQuests.map((quest) => (
                        <Button
                          key={quest}
                          variant="outline"
                          size="sm"
                        >
                          {quest}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Details */}
            {(npc.appearance || npc.personality || npc.background) && (
              <div className="space-y-4">
                <Typography variant="h4">Additional Details</Typography>
                
                {npc.appearance && (
                  <div>
                    <Typography variant="body-sm" className="font-medium mb-1">
                      Appearance
                    </Typography>
                    <Typography color="secondary">
                      {npc.appearance}
                    </Typography>
                  </div>
                )}

                {npc.personality && (
                  <div>
                    <Typography variant="body-sm" className="font-medium mb-1">
                      Personality
                    </Typography>
                    <Typography color="secondary">
                      {npc.personality}
                    </Typography>
                  </div>
                )}

                {npc.background && (
                  <div>
                    <Typography variant="body-sm" className="font-medium mb-1">
                      Background
                    </Typography>
                    <Typography color="secondary">
                      {npc.background}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-4">
              <Typography variant="h4">Notes</Typography>
              
              {/* Add Note */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  fullWidth
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  startIcon={<Plus />}
                >
                  Add
                </Button>
              </div>

              {/* Note List */}
              <div className="space-y-2">
                {npc.notes.length === 0 ? (
                  <Typography color="secondary">
                    No notes yet
                  </Typography>
                ) : (
                  npc.notes.map((note, index) => (
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
                      <Typography>
                        {note.text}
                      </Typography>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default NPCCard;