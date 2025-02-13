// src/pages/npcs/NPCsCreatePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import NPCForm from '../../components/features/npcs/NPCForm';
import { useNPCs } from '../../context/NPCContext';
import { ArrowLeft } from 'lucide-react';

const NPCsCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { npcs } = useNPCs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/npcs')}
          startIcon={<ArrowLeft />}
        >
          Back to NPCs
        </Button>
        <Typography variant="h1">Create New NPC</Typography>
      </div>

      <NPCForm
        onSuccess={() => navigate('/npcs')}
        onCancel={() => navigate('/npcs')}
        existingNPCs={npcs}
      />
    </div>
  );
};

export default NPCsCreatePage;