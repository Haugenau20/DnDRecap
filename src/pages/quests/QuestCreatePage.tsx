// src/pages/quests/QuestCreatePage.tsx
import React, { useEffect } from 'react';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import QuestCreateForm from '../../components/features/quests/QuestCreateForm';
import { useFirebase } from '../../context/FirebaseContext';
import { useNavigation } from '../../context/NavigationContext';
import { ArrowLeft } from 'lucide-react';

const QuestCreatePage: React.FC = () => {
  const { navigateToPage } = useNavigation();
  const { user } = useFirebase();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigateToPage('/quests');
    }
  }, [user, navigateToPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigateToPage('/quests')}
          startIcon={<ArrowLeft />}
        >
          Back to Quests
        </Button>
        <Typography variant="h1">Create New Quest</Typography>
      </div>

      <QuestCreateForm
        onSuccess={() => navigateToPage('/quests')}
        onCancel={() => navigateToPage('/quests')}
      />
    </div>
  );
};

export default QuestCreatePage;