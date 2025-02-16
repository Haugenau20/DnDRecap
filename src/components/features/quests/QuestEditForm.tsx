import React, { useState } from 'react';
import { Quest } from '../../../types/quest';
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

interface QuestEditFormProps {
  /** The quest being edited */
  quest: Quest;
  /** Callback when edit is successful */
  onSuccess?: () => void;
  /** Callback when editing is cancelled */
  onCancel?: () => void;
}

const QuestEditForm: React.FC<QuestEditFormProps> = ({
  quest,
  onSuccess,
  onCancel,
}) => {
  // Form state initialized with existing quest data
  const [formData, setFormData] = useState<Quest>(quest);
  const [isNPCDialogOpen, setIsNPCDialogOpen] = useState(false);
  const [selectedNPCs, setSelectedNPCs] = useState<Set<string>>(
    new Set(quest.relatedNPCIds || [])
  );
  
  // Get NPCs data
  const { npcs } = useNPCs();

  // Firebase hook
  const { updateData, loading, error } = useFirebaseData<Quest>({
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.status) {
      return;
    }

    try {
      // Update the quest in Firebase
      const updatedQuest: Quest = {
        ...formData,
        relatedNPCIds: Array.from(selectedNPCs),
        dateAdded: formData.dateAdded || new Date().toISOString().split('T')[0]
      };

      await updateData(quest.id, updatedQuest);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to update quest:', err);
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default QuestEditForm;