import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import QuestEditForm from '../../components/features/quests/QuestEditForm';
import { useQuests } from '../../hooks/useQuests';
import { useFirebase } from '../../context/FirebaseContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

const QuestEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { questId } = useParams<{ questId: string }>();
  const { quests, loading, error, refreshQuests } = useQuests();
  const { user } = useFirebase();
  
  const editingQuest = quests.find(quest => quest.id === questId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/quests');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <Typography>Loading quest data...</Typography>
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
            Error loading quest data. Please try again later.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/quests')}
          startIcon={<ArrowLeft />}
        >
          Back to Quests
        </Button>
        <Typography variant="h1">
          {editingQuest ? `Edit ${editingQuest.title}` : 'Edit Quest'}
        </Typography>
      </div>

      {editingQuest ? (
        <QuestEditForm
          quest={editingQuest}
          onSuccess={() => {
            refreshQuests(); // Refresh quest data after successful edit
            navigate('/quests');
          }}
          onCancel={() => navigate('/quests')}
        />
      ) : (
        <Card>
          <Card.Content>
            <Typography color="error">Quest not found</Typography>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default QuestEditPage;