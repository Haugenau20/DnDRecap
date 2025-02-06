// pages/NPCsPage.tsx
import React from 'react';
import Typography from '../components/core/Typography';
import NPCDirectory from '../components/features/npcs/NPCDirectory';

const NPCsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Typography variant="h1" className="mb-2">
          NPC Directory
        </Typography>
        <Typography color="secondary">
          Keep track of all the characters you've met in your adventures
        </Typography>
      </div>

      <NPCDirectory />
    </div>
  );
};

export default NPCsPage;