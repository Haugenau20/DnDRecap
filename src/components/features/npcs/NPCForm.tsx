import React, { useState } from 'react';
import { useFirebaseData } from '../../../hooks/useFirebaseData';
import { NPC, NPCStatus, NPCRelationship } from '../../../types/npc';
import { AlertCircle, Save, X } from 'lucide-react';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Typography from '../../core/Typography';
import Card from '../../core/Card';

interface NPCFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NPCForm: React.FC<NPCFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<NPC>>({
    status: 'alive',
    relationship: 'neutral',
    connections: {
      relatedNPCs: [],
      affiliations: [],
      relatedQuests: []
    },
    notes: []
  });
  const [affiliationInput, setAffiliationInput] = useState('');
  const [showError, setShowError] = useState(false);

  const { addData, loading, error } = useFirebaseData<NPC>({
    collection: 'npcs',
    idField: 'id'
  });

  const handleInputChange = (field: keyof NPC, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleAffiliationRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      connections: {
        ...prev.connections!,
        affiliations: prev.connections!.affiliations.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.status || !formData.relationship) {
      setShowError(true);
      return;
    }

    try {
      // Generate a unique ID
      const id = formData.name.toLowerCase().replace(/\s+/g, '-');
      
      // Create the complete NPC object
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
          relatedNPCs: [],
          affiliations: formData.connections?.affiliations || [],
          relatedQuests: []
        },
        notes: []
      };

      await addData(npcData);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create NPC:', err);
      setShowError(true);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Header title="Create New NPC" />
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <Typography variant="h4">Basic Information</Typography>
            <Input
              label="Name *"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              error={showError && !formData.name ? 'Name is required' : undefined}
            />
            
            <Input
              label="Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

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

          {/* Description and Appearance */}
          <div className="space-y-4">
            <Typography variant="h4">Description & Appearance</Typography>
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
          </div>

          {/* Personality and Background */}
          <div className="space-y-4">
            <Typography variant="h4">Personality & Background</Typography>
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

          {/* Affiliations */}
          <div className="space-y-4">
            <Typography variant="h4">Affiliations</Typography>
            <div className="flex gap-2">
              <Input
                value={affiliationInput}
                onChange={(e) => setAffiliationInput(e.target.value)}
                placeholder="Add affiliation"
                className="flex-1"
              />
              <Button 
                type="button"
                onClick={handleAffiliationAdd}
                disabled={!affiliationInput.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.connections?.affiliations.map((affiliation, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                >
                  <span>{affiliation}</span>
                  <button
                    type="button"
                    onClick={() => handleAffiliationRemove(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {(error || showError) && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <Typography color="error">
                {error || 'Please fill in all required fields'}
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
              {loading ? 'Creating...' : 'Create NPC'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default NPCForm;