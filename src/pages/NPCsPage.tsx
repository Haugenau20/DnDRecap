// pages/NPCsPage.tsx
import React from 'react';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import { Construction } from 'lucide-react';

const NPCsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h1" className="mb-6">NPC Directory</Typography>
      
      <Card className="text-center p-12">
        <Construction className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <Typography variant="h3" className="mb-4">
          NPC Directory Coming Soon
        </Typography>
        <Typography color="secondary">
          The NPC directory is being crafted. Soon you'll be able to:
        </Typography>
        <ul className="mt-4 space-y-2">
          <li>
            <Typography color="secondary">• Browse detailed NPC profiles</Typography>
          </li>
          <li>
            <Typography color="secondary">• Search and filter NPCs by location or relationship</Typography>
          </li>
          <li>
            <Typography color="secondary">• View NPC connections to quests and other characters</Typography>
          </li>
          <li>
            <Typography color="secondary">• Track NPC relationships and status</Typography>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default NPCsPage;