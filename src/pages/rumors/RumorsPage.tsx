// src/pages/rumors/RumorsPage.tsx
import React, { useState, useMemo } from 'react';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import RumorDirectory from '../../components/features/rumors/RumorDirectory';
import CombineRumorsDialog from '../../components/features/rumors/CombineRumorsDialog';
import ConvertToQuestDialog from '../../components/features/rumors/ConvertToQuestDialog';
import { useRumors } from '../../context/RumorContext';
import { useFirebase } from '../../context/FirebaseContext';
import { useNavigation } from '../../hooks/useNavigation';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Loader2,
  Plus
} from 'lucide-react';

const RumorsPage: React.FC = () => {
  // Auth state
  const { user } = useFirebase();
  const { rumors, isLoading, error, combineRumors, convertToQuest } = useRumors();
  const { navigateToPage } = useNavigation();
  
  // Dialog state
  const [showCombineDialog, setShowCombineDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedRumorIds, setSelectedRumorIds] = useState<string[]>([]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: rumors.length,
    confirmed: rumors.filter(rumor => rumor.status === 'confirmed').length,
    unconfirmed: rumors.filter(rumor => rumor.status === 'unconfirmed').length,
    false: rumors.filter(rumor => rumor.status === 'false').length
  }), [rumors]);

  // Handle opening combine dialog with selected rumors
  const handleCombineRumors = (rumorIds: string[]) => {
    setSelectedRumorIds(rumorIds);
    setShowCombineDialog(true);
  };

  // Handle opening convert dialog with selected rumors
  const handleConvertToQuest = (rumorIds: string[]) => {
    setSelectedRumorIds(rumorIds);
    setShowConvertDialog(true);
  };

  // Handle create new rumor
  const handleCreateRumor = () => {
    navigateToPage('/rumors/create');
  };

  // Handle combine rumors submission
  const handleCombineSubmit = async (rumorIds: string[], newRumor: Partial<any>) => {
    return await combineRumors(rumorIds, newRumor);
  };

  // Handle convert to quest submission
  const handleConvertSubmit = async (rumorIds: string[], questData: Partial<any>) => {
    return await convertToQuest(rumorIds, questData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <Typography>Loading rumors...</Typography>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <Typography color="error">
            Error Loading Rumors. Sign in to view content.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <Typography variant="h1" className="mb-2">
            Rumors
          </Typography>
          <Typography color="secondary">
            Track and investigate rumors from across the realm
          </Typography>
        </div>

        {/* Auth actions */}
        <div className="flex gap-2">
          {user && (
            <Button
              onClick={handleCreateRumor}
              startIcon={<Plus className="w-5 h-5" />}
            >
              Add Rumor
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <MessageSquare className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.total}
              </Typography>
              <Typography color="secondary">
                Total Rumors
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.confirmed}
              </Typography>
              <Typography color="secondary">
                Confirmed
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <HelpCircle className="w-8 h-8 text-yellow-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.unconfirmed}
              </Typography>
              <Typography color="secondary">
                Unconfirmed
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <XCircle className="w-8 h-8 text-red-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.false}
              </Typography>
              <Typography color="secondary">
                False
              </Typography>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Rumor Directory */}
      <RumorDirectory 
        rumors={rumors} 
        isLoading={isLoading} 
      />

      {/* Dialogs */}
      <CombineRumorsDialog
        open={showCombineDialog}
        onClose={() => setShowCombineDialog(false)}
        rumorIds={selectedRumorIds}
        rumors={rumors}
        onCombine={handleCombineSubmit}
      />
      
      <ConvertToQuestDialog
        open={showConvertDialog}
        onClose={() => setShowConvertDialog(false)}
        rumorIds={selectedRumorIds}
        rumors={rumors}
        onConvert={handleConvertSubmit}
      />
    </div>
  );
};

export default RumorsPage;