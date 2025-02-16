import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Location, LocationNote, LocationType } from '../../../types/location';
import { useNPCs } from '../../../context/NPCContext';
import { useQuests } from '../../../hooks/useQuests';
import { useFirebase } from '../../../context/FirebaseContext';
import { useFirebaseData } from '../../../hooks/useFirebaseData';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Button from '../../core/Button';
import Input from '../../core/Input';
import { 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Scroll,
  Users,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Building,
  Landmark,
  Mountain,
  Home,
  MapPinOff,
  PlusCircle,
  Edit,
  X,
  Save
} from 'lucide-react';

interface LocationCardProps {
  location: Location;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEdit?: (location: Location) => void;
}

const formatLocationType = (type: LocationType): string => {
  if (type === 'poi') return 'Point of Interest';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Map location types to icons
const typeIcons: Record<LocationType, React.ReactNode> = {
  region: <Mountain className="text-blue-500" />,
  city: <Building className="text-gray-500" />,
  town: <Home className="text-green-500" />,
  village: <Home className="text-green-400" />,
  dungeon: <Building className="text-red-500" />,
  landmark: <Landmark className="text-purple-500" />,
  building: <Building className="text-gray-400" />,
  poi: <MapPin className="text-yellow-500" />
};

const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  hasChildren,
  isExpanded,
  onToggleExpand,
  onEdit 
}) => {
  const navigate = useNavigate();
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { getNPCById } = useNPCs();
  const { getQuestById } = useQuests();
  const { user } = useFirebase();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const { updateData } = useFirebaseData<Location>({ collection: 'locations' });

  // Handle editing the location
  const handleEdit = () => {
    navigate(`/locations/edit/${location.id}`);
  };

  // Handle quick note adding
  const handleAddNote = async () => {
    if (!noteInput.trim()) return;

    const newNote: LocationNote = {
      date: new Date().toISOString().split('T')[0],
      text: noteInput.trim()
    };

    try {
      const updatedLocation = {
        ...location,
        notes: [...(location.notes || []), newNote]
      };

      await updateData(location.id, updatedLocation);
      setNoteInput('');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  // Fetch NPC data at component level
  const connectedNPCs = location.connectedNPCs 
    ? location.connectedNPCs
        .map(id => getNPCById(id))
        .filter((npc): npc is NonNullable<ReturnType<typeof getNPCById>> => npc !== undefined)
    : [];

  // Get status icon
  const getStatusIcon = () => {
    switch (location.status) {
      case 'discovered':
        return <Eye className="text-green-500" />;
      case 'undiscovered':
        return <EyeOff className="text-gray-400" />;
      case 'visited':
        return <MapPin className="text-blue-500" />;
      default:
        return <MapPinOff className="text-gray-400" />;
    }
  };

  // Handle NPC click
  const handleNPCClick = (npcId: string) => {
    navigate(`/npcs?highlight=${encodeURIComponent(npcId)}`);
  };

  // Inside the LocationCard component, add:
  const handleQuestClick = (questId: string) => {
    navigate(`/quests?highlight=${encodeURIComponent(questId)}`);
  };

  return (
    <Card>
      <Card.Content className="space-y-4">
        {/* Location Header */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {typeIcons[location.type]}
          </div>
          <div className="flex-1">
            <Typography variant="h4">
              {location.name}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  startIcon={<Edit size={16} />}
                >
                  Edit
                </Button>
              )}
            </Typography>
            
            <div className="flex items-center gap-2 mt-1">
              <Typography variant="body-sm" color="secondary">
                {formatLocationType(location.type)}
              </Typography>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                <Typography variant="body-sm" color="secondary">
                  {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <Typography color="secondary">
          {location.description}
        </Typography>

        {/* Basic Info */}
        <div className="flex flex-wrap gap-4">
          {connectedNPCs.length > 0 && (
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              <Typography variant="body-sm" color="secondary">
                {connectedNPCs.length} NPCs
              </Typography>
            </div>
          )}
          {location.relatedQuests && location.relatedQuests.length > 0 && (
            <div className="flex items-center gap-2">
              <Scroll size={16} className="text-gray-400" />
              <Typography variant="body-sm" color="secondary">
                {location.relatedQuests.length} Quests
              </Typography>
            </div>
          )}
          {location.lastVisited && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <Typography variant="body-sm" color="secondary">
                Last visited: {location.lastVisited}
              </Typography>
            </div>
          )}
        </div>


        {/* Expanded Content */}
        {isContentExpanded && (
          <div className="pt-4 space-y-4 border-t border-gray-100">
            {/* Notable Features */}
            {location.features && location.features.length > 0 && (
              <div>
                <Typography variant="body" className="font-medium mb-2">
                  Notable Features
                </Typography>
                <ul className="space-y-1">
                  {location.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Landmark size={16} className="text-gray-400 mt-1" />
                      <Typography variant="body-sm" color="secondary">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Quests */}
            {location.relatedQuests && location.relatedQuests.length > 0 && (
              <div>
                <Typography variant="body" className="font-medium mb-2">
                  Related Quests
                </Typography>
                <div className="space-y-2">
                  {location.relatedQuests.map((questId) => {
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

            {/* Connected NPCs */}
            {connectedNPCs.length > 0 && (
              <div>
                <Typography variant="body" className="font-medium mb-2">
                  Connected NPCs
                </Typography>
                <div className="space-y-2">
                  {connectedNPCs.map((npc) => (
                    <Button
                      key={npc.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNPCClick(npc.id)}
                      className="w-full"
                      centered={false}
                    >
                      <div className="flex items-start gap-2 text-left">
                        <Users 
                          size={16} 
                          className={`mt-1 ${
                            npc.relationship === 'friendly' ? 'text-green-500' :
                            npc.relationship === 'hostile' ? 'text-red-500' :
                            npc.relationship === 'neutral' ? 'text-gray-400' :
                            'text-blue-500'
                          }`}
                        />
                        <div className="flex-1">
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
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {location.tags && location.tags.length > 0 && (
              <div>
                <Typography variant="body" className="font-medium mb-2">
                  Tags
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                    >
                      <Tag size={12} className="text-gray-400" />
                      <Typography variant="body-sm" color="secondary">
                        {tag}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {location.notes && location.notes.length > 0 && (
              <div>
                <Typography variant="body" className="font-medium mb-2">
                  Notes
                </Typography>
                <div className="space-y-2">
                  {location.notes.slice(0, 3).map((note) => (
                    <div className="p-3 bg-gray-50 rounded-lg space-y-1">
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
              </div>
            )}
          </div>
        )}

        {/* Quick Note Adding - Only visible when authenticated */}
        {user && (
            <div>
              {isAddingNote ? (
                <div className="space-y-2">
                  <Input
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Enter note..."
                    isTextArea={true}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!noteInput.trim()}
                      startIcon={<Save size={16} />}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingNote(false);
                        setNoteInput('');
                      }}
                      startIcon={<X size={16} />}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingNote(true)}
                  startIcon={<PlusCircle size={16} />}
                >
                  Add Note
                </Button>
              )}
            </div>
          )}

        {/* Expand/Collapse Buttons */}
        <div className="flex gap-2">
          {/* Location content expand/collapse */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsContentExpanded(!isContentExpanded)}
            className="w-full"
            startIcon={isContentExpanded ? <ChevronUp /> : <ChevronDown />}
          >
            {isContentExpanded ? 'Less Details' : 'More Details'}
          </Button>

          {/* Children expand/collapse */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="flex-shrink-0"
              startIcon={isExpanded ? <ChevronUp /> : <ChevronDown />}
            >
              {isExpanded ? 'Hide Places Within' : 'Show Places Within'}
            </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default LocationCard;