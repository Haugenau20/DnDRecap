// pages/StoryPage.tsx
import React from 'react';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import { Construction } from 'lucide-react';

const StoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h1" className="mb-6">Campaign Story</Typography>
      
      <Card className="text-center p-12">
        <Construction className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <Typography variant="h3" className="mb-4">
          Story Viewer Coming Soon
        </Typography>
        <Typography color="secondary">
          The story viewer is under construction. Soon you'll be able to:
        </Typography>
        <ul className="mt-4 space-y-2">
          <li>
            <Typography color="secondary">• Read through chapter-based story content</Typography>
          </li>
          <li>
            <Typography color="secondary">• Navigate using an interactive table of contents</Typography>
          </li>
          <li>
            <Typography color="secondary">• Track your reading progress</Typography>
          </li>
          <li>
            <Typography color="secondary">• Search within chapters</Typography>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default StoryPage;
