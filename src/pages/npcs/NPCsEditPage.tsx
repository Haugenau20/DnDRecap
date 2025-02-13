// src/pages/npcs/NPCsEditPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import NPCEditForm from '../../components/features/npcs/NPCEditForm';
import { useNPCs } from '../../context/NPCContext';
import { ArrowLeft } from 'lucide-react';

const NPCsEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { npcId } = useParams<{ npcId: string }>();
  const { npcs } = useNPCs();
  
  const editingNPC = npcs.find(npc => npc.id === npcId);

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
        <Typography variant="h1">
          {editingNPC ? `Edit ${editingNPC.name}` : 'Edit NPC'}
        </Typography>
      </div>

      {editingNPC ? (
        <NPCEditForm
          npc={editingNPC}
          mode="edit"
          onSuccess={() => navigate('/npcs')}
          onCancel={() => navigate('/npcs')}
          existingNPCs={npcs}
        />
      ) : (
        <Card>
          <Card.Content>
            <Typography color="error">NPC not found</Typography>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default NPCsEditPage;