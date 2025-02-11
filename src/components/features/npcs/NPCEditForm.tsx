import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NPC, NPCStatus, NPCRelationship, NPCNote } from '../../../types/npc';
import { useFirebaseData } from '../../../hooks/useFirebaseData';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Card from '../../core/Card';
import { 
  LogIn, 
  AlertCircle, 
  Users, 
  X,
  Save,
  PlusCircle,
  Calendar
} from 'lucide-react';

interface NPCEditFormProps {
  npc?: NPC;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
  existingNPCs: NPC[];
}

const NPCEditForm: React.FC<NPCEditFormProps> = ({
  npc,
  mode = 'create',
  onSuccess,
  onCancel,
  existingNPCs
}) => {
  // Form state initialized with existing NPC data if provided
  const [formData, setFormData] = useState<Partial<NPC>>(
    npc || {
      status: 'alive',
      relationship: 'neutral',
      connections: {
        relatedNPCs: [],
        affiliations: [],
        relatedQuests: []
      },
      notes: []
    }
  );

  const [affiliationInput, setAffiliationInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Firebase hooks
  const { updateData, addData, loading, error } = useFirebaseData<NPC>({
    collection: 'npcs'
  });

  // Handle basic input changes
  const handleInputChange = (field: keyof NPC, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle affiliation changes
  const handleAffiliationAdd = () => {
    if (affiliationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        connections: {
          ...prev.connections!,
          affiliations: [...(prev.connections?.affiliations || []), affiliationInput.trim()]
        }
      }));
      setAffiliationInput('');
    }
  };

  // Handle quick note adding
  const handleAddNote = () => {
    if (noteInput.trim()) {
      const newNote: NPCNote = {
        date: new Date().toISOString().split('T')[0],
        text: noteInput.trim()
      };

      setFormData(prev => ({
        ...prev,
        notes: [...(prev.notes || []), newNote]
      }));
      setNoteInput('');
      setIsAddingNote(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.status || !formData.relationship) {
      return;
    }

    try {
      const id = npc?.id || formData.name.toLowerCase().replace(/\s+/g, '-');
      
      const npcData: NPC = {
        id,
        name: formData.name,
        title: formData.title || '',
        status: formData.status as NPCStatus,
        race: formData.race || '',
        occupation: formData.occupation || '',
        location: formData.location || '',
        relationship: formData.relationship as NPCRelationship,
        description: formData.description || '',
        appearance: formData.appearance || '',
        personality: formData.personality || '',
        background: formData.background || '',
        connections: {
          relatedNPCs: formData.connections?.relatedNPCs || [],
          affiliations: formData.connections?.affiliations || [],
          relatedQuests: formData.connections?.relatedQuests || []
        },
        notes: formData.notes || []
      };

      if (npc) {
        await updateData(id, npcData);
      } else {
        await addData(npcData);
      }
      onSuccess?.();
    } catch (err) {
      console.error('Failed to save NPC:', err);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Header title={npc ? `Edit ${npc.name}` : 'Create New NPC'} />
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Note Adding */}
          {npc && (
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingNote(!isAddingNote)}
                startIcon={<PlusCircle />}
              >
                Add Quick Note
              </Button>

              {isAddingNote && (
                <div className="mt-4 space-y-4">
                  <Input
                    label="New Note"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Enter note text..."
                    isTextArea={true}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddNote}
                      disabled={!noteInput.trim()}
                    >
                      Add Note
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingNote(false);
                        setNoteInput('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <Typography variant="h4">Basic Information</Typography>
            <Input
              label="Name *"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <Input
              label="Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

            {/* Status and Relationship Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="alive">Alive</option>
                  <option value="deceased">Deceased</option>
                  <option value="missing">Missing</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Relationship *</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={formData.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  required
                >
                  <option value="friendly">Friendly</option>
                  <option value="neutral">Neutral</option>
                  <option value="hostile">Hostile</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            {/* Additional Fields */}
            <Input
              label="Race"
              value={formData.race || ''}
              onChange={(e) => handleInputChange('race', e.target.value)}
            />

            <Input
              label="Occupation"
              value={formData.occupation || ''}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
            />

            <Input
              label="Location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          {/* Character Details */}
          <div className="space-y-4">
            <Typography variant="h4">Character Details</Typography>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full rounded-lg border p-2 h-24"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Appearance</label>
              <textarea
                className="w-full rounded-lg border p-2 h-24"
                value={formData.appearance || ''}
                onChange={(e) => handleInputChange('appearance', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Personality</label>
              <textarea
                className="w-full rounded-lg border p-2 h-24"
                value={formData.personality || ''}
                onChange={(e) => handleInputChange('personality', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Background</label>
              <textarea
                className="w-full rounded-lg border p-2 h-24"
                value={formData.background || ''}
                onChange={(e) => handleInputChange('background', e.target.value)}
              />
            </div>
          </div>

          {/* Notes Display */}
          {formData.notes && formData.notes.length > 0 && (
            <div className="space-y-4">
              <Typography variant="h4">Notes</Typography>
              <div className="space-y-2">
                {formData.notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <Typography variant="body-sm" color="secondary">
                          {note.date}
                        </Typography>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            notes: prev.notes?.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <Typography variant="body-sm">
                      {note.text}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              startIcon={<Save />}
            >
              {loading ? 'Saving...' : 'Save NPC'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default NPCEditForm;