// src/components/features/quests/QuestCreateForm.tsx
import React, { useState } from 'react';
import { Quest, QuestStatus } from '../../../types/quest';
import { useFirebaseData } from '../../../hooks/useFirebaseData';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Card from '../../core/Card';
import Dialog from '../../core/Dialog';
import { useNPCs } from '../../../context/NPCContext';
import LocationCombobox from '../locations/LocationCombobox';
import { 
  AlertCircle, 
  Save, 
  X, 
  Users, 
  MapPin, 
  PlusCircle,
  Target,
  Lightbulb,
  Coins,
  Skull
} from 'lucide-react';

interface QuestCreateFormProps {
  /** Callback when creation is successful */
  onSuccess?: () => void;
  /** Callback when creation is cancelled */
  onCancel?: () => void;
}

const QuestCreateForm: React.FC<QuestCreateFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  // Initial empty quest state
  const [formData, setFormData] = useState<Partial<Quest>>({
    status: 'active',
    objectives: [],
    keyLocations: [],
    importantNPCs: [],
    relatedNPCIds: [],
    leads: [],
    complications: [],
    rewards: [],
    dateAdded: new Date().toISOString().split('T')[0]
  });

  // Dialog and NPC selection state
  const [isNPCDialogOpen, setIsNPCDialogOpen] = useState(false);
  const [selectedNPCs, setSelectedNPCs] = useState<Set<string>>(new Set());
  
  // Get NPCs data
  const { npcs } = useNPCs();

  // Firebase hook
  const { addData, loading, error } = useFirebaseData<Quest>({
    collection: 'quests'
  });

  // Handle basic input changes
  const handleInputChange = <K extends keyof Quest>(
    field: K,
    value: Quest[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle objective changes
  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [
        ...(prev.objectives || []),
        {
          id: crypto.randomUUID(),
          description: '',
          completed: false
        }
      ]
    }));
  };

  const handleRemoveObjective = (objectiveId: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.filter(obj => obj.id !== objectiveId) || []
    }));
  };

  // Handle location additions
  const handleAddLocation = () => {
    setFormData(prev => ({
      ...prev,
      keyLocations: [
        ...(prev.keyLocations || []),
        { name: '', description: '' }
      ]
    }));
  };

  const handleRemoveLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyLocations: prev.keyLocations?.filter((_, i) => i !== index)
    }));
  };

  const handleAddReward = () => {
    setFormData(prev => ({
      ...prev,
      rewards: [
        ...(prev.rewards || []), ''
      ]
    }));
  };

  const handleRemoveReward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards?.filter((_, i) => i !== index)
    }))
  }

  const handleAddLead = () => {
    setFormData(prev => ({
      ...prev,
      leads: [
        ...(prev.leads || []), ''
      ]
    }));
  };

  const handleRemoveLead = (index: number) => {
    setFormData(prev => ({
      ...prev,
      leads: prev.leads?.filter((_, i) => i !== index)
    }))
  }

  const handleAddComplication = () => {
    setFormData(prev => ({
      ...prev,
      complications: [
        ...(prev.complications || []), ''
      ]
    }));
  };

  const handleRemoveComplication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      complications: prev.complications?.filter((_, i) => i !== index)
    }))
  }

  // Handle array field additions (leads, complications, rewards)
  const handleArrayFieldAdd = (field: 'leads' | 'complications' | 'rewards', value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
  };

  const handleArrayFieldRemove = (field: 'leads' | 'complications' | 'rewards', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
  };

  // Generate quest ID from title
  const generateQuestId = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      return;
    }

    try {
      const questId = generateQuestId(formData.title);
      const questData: Quest = {
        id: questId,
        title: formData.title,
        description: formData.description,
        status: formData.status as QuestStatus,
        background: formData.background || '',
        objectives: formData.objectives || [],
        leads: formData.leads || [],
        keyLocations: formData.keyLocations || [],
        importantNPCs: formData.importantNPCs || [],
        relatedNPCIds: Array.from(selectedNPCs),
        complications: formData.complications || [],
        rewards: formData.rewards || [],
        location: formData.location || '',
        levelRange: formData.levelRange || '',
        dateAdded: formData.dateAdded || new Date().toISOString().split('T')[0]
      };

      await addData(questData, questId); // Use the generated ID when adding to Firestore
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create quest:', err);
    }
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <Typography variant="h4">Basic Information</Typography>
            <Input
              label="Title *"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
            
            <Input
              label="Description *"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              isTextArea
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as QuestStatus)}
                  required
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <LocationCombobox
                label="Location"
                value={formData.location || ''}
                onChange={(value) => handleInputChange('location', value)}
              />
            </div>

            <Input
              label="Level Range"
              value={formData.levelRange || ''}
              onChange={(e) => handleInputChange('levelRange', e.target.value)}
              placeholder="e.g., 1-5"
              startIcon={<Target className="w-4 h-4" />}
            />

            <Input
              label="Background"
              value={formData.background || ''}
              onChange={(e) => handleInputChange('background', e.target.value)}
              isTextArea
            />
          </div>

          {/* Objectives */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Objectives</Typography>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddObjective}
                startIcon={<PlusCircle />}
              >
                Add Objective
              </Button>
            </div>
            <div className="space-y-2">
              {formData.objectives?.map((objective) => (
                <div key={objective.id} className="flex gap-4">
                  <input
                    type="checkbox"
                    checked={objective.completed}
                    onChange={(e) => {
                      const newObjectives = formData.objectives?.map(obj =>
                        obj.id === objective.id
                          ? { ...obj, completed: e.target.checked }
                          : obj
                      );
                      handleInputChange('objectives', newObjectives || []);
                    }}
                    className="mt-2 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Input
                      value={objective.description}
                      onChange={(e) => {
                        const newObjectives = formData.objectives?.map(obj =>
                          obj.id === objective.id
                            ? { ...obj, description: e.target.value }
                            : obj
                        );
                        handleInputChange('objectives', newObjectives || []);
                      }}
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveObjective(objective.id)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Initial Leads */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Initial Leads</Typography>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddLead}
                startIcon={<Lightbulb />}
              >
                Add Inital Leads
              </Button>
            </div>
            <div className="space-y-4">
              {formData.leads?.map((lead, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Initial Lead"
                      value={lead}
                      onChange={(e) => {
                        const newLeads = [...(formData.leads || [])];
                        newLeads[index] = e.target.value
                        handleInputChange('leads', newLeads);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveLead(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Locations */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Key Locations</Typography>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddLocation}
                startIcon={<MapPin />}
              >
                Add Location
              </Button>
            </div>
            <div className="space-y-4">
              {formData.keyLocations?.map((location, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Location name"
                      value={location.name}
                      onChange={(e) => {
                        const newLocations = [...(formData.keyLocations || [])];
                        newLocations[index] = {
                          ...location,
                          name: e.target.value
                        };
                        handleInputChange('keyLocations', newLocations);
                      }}
                    />
                    <Input
                      placeholder="Description"
                      value={location.description}
                      onChange={(e) => {
                        const newLocations = [...(formData.keyLocations || [])];
                        newLocations[index] = {
                          ...location,
                          description: e.target.value
                        };
                        handleInputChange('keyLocations', newLocations);
                      }}
                      isTextArea
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveLocation(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Related NPCs */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Related NPCs</Typography>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsNPCDialogOpen(true)}
                startIcon={<Users />}
              >
                Select NPCs
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedNPCs).map(npcId => {
                const npc = npcs.find(n => n.id === npcId);
                return npc ? (
                  <div
                    key={npcId}
                    className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                  >
                    <span>{npc.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNPCs(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(npcId);
                          return newSet;
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Complications */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Complications</Typography>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddComplication}
                startIcon={<Skull />}
              >
                Add Complication
              </Button>
            </div>
            <div className="space-y-4">
              {formData.complications?.map((complication, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Complication"
                      value={complication}
                      onChange={(e) => {
                        const newComplications = [...(formData.complications || [])];
                        newComplications[index] = e.target.value
                        handleInputChange('complications', newComplications);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveComplication(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Typography variant="h4">Rewards</Typography>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddReward}
                startIcon={<Coins />}
              >
                Add Reward
              </Button>
            </div>
            <div className="space-y-4">
              {formData.rewards?.map((reward, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Reward"
                      value={reward}
                      onChange={(e) => {
                        const newRewards = [...(formData.rewards || [])];
                        newRewards[index] = e.target.value
                        handleInputChange('rewards', newRewards);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveReward(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <Typography color="error">
                {error}
              </Typography>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
              type="button"
              startIcon={<X />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              startIcon={<Save />}
            >
              {loading ? 'Creating...' : 'Create Quest'}
            </Button>
          </div>
        </form>
      </Card.Content>

      {/* NPC Selection Dialog */}
      <Dialog
        open={isNPCDialogOpen}
        onClose={() => setIsNPCDialogOpen(false)}
        title="Select Related NPCs"
        maxWidth="max-w-3xl"
      >
        <div className="max-h-96 overflow-y-auto mb-4">
          <div className="grid grid-cols-3 gap-2">
            {npcs.map(npc => (
              <button
                key={npc.id}
                onClick={() => {
                  setSelectedNPCs(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(npc.id)) {
                      newSet.delete(npc.id);
                    } else {
                      newSet.add(npc.id);
                    }
                    return newSet;
                  });
                }}
                className={`p-2 rounded text-center transition-colors ${
                  selectedNPCs.has(npc.id)
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Typography 
                  variant="body-sm"
                  className={selectedNPCs.has(npc.id) ? 'font-medium' : ''}
                >
                  {npc.name}
                </Typography>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setIsNPCDialogOpen(false)}>Done</Button>
        </div>
      </Dialog>
    </Card>
  );
};

export default QuestCreateForm;