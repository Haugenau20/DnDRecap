// pages/QuestsPage.tsx
import React from 'react';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import { Construction } from 'lucide-react';

const QuestsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h1" className="mb-6">Quest Tracker</Typography>
      
      <Card className="text-center p-12">
        <Construction className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <Typography variant="h3" className="mb-4">
          Quest System Coming Soon
        </Typography>
        <Typography color="secondary">
          The quest tracking system is under development. Soon you'll be able to:
        </Typography>
        <ul className="mt-4 space-y-2">
          <li>
            <Typography color="secondary">• View active and completed quests</Typography>
          </li>
          <li>
            <Typography color="secondary">• Track quest objectives and rewards</Typography>
          </li>
          <li>
            <Typography color="secondary">• See quest connections to NPCs and locations</Typography>
          </li>
          <li>
            <Typography color="secondary">• Filter and organize quests</Typography>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default QuestsPage;