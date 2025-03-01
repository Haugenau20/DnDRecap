// src/components/features/rumors/ConvertToQuestDialog.tsx
import React, { useState, useEffect } from 'react';
import { Rumor } from '../../../types/rumor';
import { Quest, QuestObjective } from '../../../types/quest';
import Dialog from '../../core/Dialog';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import { X, MessageSquare, PlusCircle, AlertCircle } from 'lucide-react';

interface ConvertToQuestDialogProps {
  open: boolean;
  onClose: () => void;
  rumorIds: string[];
  rumors: Rumor[];
  onConvert: (rumorIds: string[], questData: Partial<Omit<Quest, 'id'>>) => Promise<string>;
}

/**
 * Dialog component for converting rumors to quests
 */
const ConvertToQuestDialog: React.FC<ConvertToQuestDialogProps> = ({
  open,
  onClose,
  rumorIds,
  rumors,
  onConvert
}) => {
  // Form state for the new quest
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState('');
  const [location, setLocation] = useState('');
  const [objectives, setObjectives] = useState<Partial<QuestObjective>[]>([
    { id: crypto.randomUUID(), description: '', completed: false }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form based on selected rumors
  useEffect(() => {
    if (open && rumorIds.length > 0) {
      const selectedRumors = rumorIds
        .map(id => rumors.find(r => r.id === id))
        .filter(Boolean) as Rumor[];
      
      if (selectedRumors.length === 1) {
        // If only one rumor, use its title and content directly
        setTitle(selectedRumors[0].title);
        setDescription(selectedRumors[0].content);
        
        // Make sure to capture the location
        setLocation(selectedRumors[0].location || '');
      } else {
        // If multiple rumors, create a combined title
        setTitle(`Quest: ${selectedRumors[0].title}`);
        
        // Combine content from all rumors for the description
        const combinedContent = selectedRumors.map(rumor => 
          `${rumor.title}: ${rumor.content}`
        ).join('\n\n');
        
        setDescription(combinedContent);
        
        // For location, use the first rumor's location as default
        setLocation(selectedRumors[0]?.location || '');
      }
      
      // Create background from rumors
      setBackground(`This quest was derived from rumors about:\n` + 
        selectedRumors.map(rumor => 
          `- ${rumor.title} (from ${rumor.sourceName})`
        ).join('\n'));
      
      // Create initial objectives based on rumor count
      if (selectedRumors.length > 1) {
        setObjectives(
          selectedRumors.map(rumor => ({
            id: crypto.randomUUID(),
            description: `Investigate the rumor about "${rumor.title}"`,
            completed: false
          }))
        );
      }
    }
  }, [open, rumorIds, rumors]);

  // Add a new objective
  const handleAddObjective = () => {
    setObjectives(prev => [
      ...prev,
      { id: crypto.randomUUID(), description: '', completed: false }
    ]);
  };

  // Remove an objective
  const handleRemoveObjective = (id: string) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id));
  };

  // Update an objective
  const handleObjectiveChange = (id: string, description: string) => {
    setObjectives(prev => 
      prev.map(obj => 
        obj.id === id ? { ...obj, description } : obj
      )
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (rumorIds.length === 0) {
      setError('Please select at least one rumor to convert');
      return;
    }

    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    // Validate all objectives have descriptions
    if (objectives.some(obj => !obj.description)) {
      setError('All objectives must have descriptions');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Collect related NPCs and locations from all rumors
      const selectedRumors = rumorIds
        .map(id => rumors.find(r => r.id === id))
        .filter(Boolean) as Rumor[];
      
      const relatedNPCIds = [...new Set(
        selectedRumors.flatMap(rumor => 
          Array.isArray(rumor.relatedNPCs) ? rumor.relatedNPCs : []
        )
      )];
      
      // Create the quest data
      const questData: Partial<Omit<Quest, 'id'>> = {
        title,
        description,
        background,
        status: 'active',
        objectives: objectives as QuestObjective[],
        relatedNPCIds,
        location, // Use the location state
        dateAdded: new Date().toISOString().split('T')[0]
      };

      await onConvert(rumorIds, questData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert rumors to quest');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected rumors objects
  const selectedRumors = rumorIds
    .map(id => rumors.find(r => r.id === id))
    .filter(Boolean) as Rumor[];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Convert to Quest"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Selected Rumors */}
        <div>
          <Typography variant="h4" className="mb-3">
            Source Rumors
          </Typography>
          {selectedRumors.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
              {selectedRumors.map(rumor => (
                <div
                  key={rumor.id}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  <Typography variant="body-sm" className="font-medium">
                    {rumor.title}
                  </Typography>
                  <Typography variant="body-sm" color="secondary">
                    Source: {rumor.sourceName}
                  </Typography>
                  {rumor.location && (
                    <Typography variant="body-sm" color="secondary">
                      Location: {rumor.location}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Typography color="secondary">
              No rumors selected. Please select at least one rumor to convert.
            </Typography>
          )}
        </div>

        {/* Quest Form */}
        <div className="space-y-4">
          <Typography variant="h4">
            New Quest Details
          </Typography>

          <Input
            label="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isTextArea
            required
            disabled={isSubmitting}
          />

          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            label="Background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            isTextArea
            disabled={isSubmitting}
          />

          {/* Objectives */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="body" className="font-medium">
                Objectives
              </Typography>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddObjective}
                startIcon={<PlusCircle size={16} />}
                disabled={isSubmitting}
              >
                Add Objective
              </Button>
            </div>
            
            <div className="space-y-2">
              {objectives.map((objective) => (
                <div key={objective.id} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={objective.description || ''}
                      onChange={(e) => handleObjectiveChange(objective.id!, e.target.value)}
                      placeholder="Objective description"
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveObjective(objective.id!)}
                    disabled={isSubmitting || objectives.length <= 1}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={16} />
            <Typography color="error">{error}</Typography>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedRumors.length === 0}
            startIcon={<MessageSquare />}
            isLoading={isSubmitting}
          >
            Create Quest
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConvertToQuestDialog;