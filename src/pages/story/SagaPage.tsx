// pages/story/SagaPage.tsx
import React from 'react';
import Typography from '../../components/core/Typography';
import Card from '../../components/core/Card';
import Button from '../../components/core/Button';
import { useStory } from '../../context/StoryContext';
import { Book } from 'lucide-react';

const SagaPage = () => {
  const { chapters } = useStory();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h1">Campaign Saga</Typography>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          startIcon={<Book />}
        >
          Back to Selection
        </Button>
      </div>

      <Card>
        <Card.Content>
          <Typography color="secondary" className="mb-4">
            Here you'll find your campaign's story woven into a seamless narrative.
          </Typography>
          {/* Content will be added here */}
          <Typography variant="body" className="italic text-center">
            The saga is yet to be written...
          </Typography>
        </Card.Content>
      </Card>
    </div>
  );
};

export default SagaPage;