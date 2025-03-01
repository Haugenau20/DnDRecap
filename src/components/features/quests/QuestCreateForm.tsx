// src/components/features/quests/QuestCreateForm.tsx
import React, { useState, useEffect } from 'react';
import { Quest, QuestStatus } from '../../../types/quest';
import { useFirebaseData } from '../../../hooks/useFirebaseData';
import Typography from '../../core/Typography';
import Button from '../../core/Button';
import Card from '../../core/Card';
import { useNPCs } from '../../../context/NPCContext';
import {
  BasicInfoSection,
  ObjectivesSection,
  LeadsSection,
  KeyLocationsSection,
  ComplicationsSection,
  RewardsSection,
  RelatedNPCsSection
} from './QuestFormSections';
import { 
  AlertCircle, 
  Save, 
  X, 
} from 'lucide-react';

interface QuestCreateFormProps {
  /** Initial data for the form (e.g., from a converted rumor) */
  initialData?: Partial<Quest>;
  /** Callback when creation is successful */
  onSuccess?: () => void;
  /** Callback when creation is cancelled */
  onCancel?: () => void;
}

const QuestCreateForm: React.FC<QuestCreateFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  // Initial quest state
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

  // Apply initial data when available
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));

      // Set selected NPCs if provided
      if (initialData.relatedNPCIds && initialData.relatedNPCIds.length > 0) {
        setSelectedNPCs(new Set(initialData.relatedNPCIds));
      }
    }
  }, [initialData]);

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
        <BasicInfoSection 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        
        <ObjectivesSection 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        
        <LeadsSection 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        
        <KeyLocationsSection 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        
        <ComplicationsSection 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        
        <RewardsSection 
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <RelatedNPCsSection 
          formData={formData}
          handleInputChange={handleInputChange}
          npcs={npcs}
          selectedNPCs={selectedNPCs}
          setSelectedNPCs={setSelectedNPCs}
          isNPCDialogOpen={isNPCDialogOpen}
          setIsNPCDialogOpen={setIsNPCDialogOpen}
        />

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
    </Card>
  );
};

export default QuestCreateForm;