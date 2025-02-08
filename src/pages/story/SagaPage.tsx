// pages/story/SagaPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookViewer from '../../components/features/story/BookViewer';
import Typography from '../../components/core/Typography';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import { Book, Loader2 } from 'lucide-react';
import { SagaData } from '../../types/saga';

// Import the saga data
import sagaData from '../../data/story/saga.json';

const SagaPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SagaData | null>(null);

  // Load saga data
  useEffect(() => {
    try {
      const typedData = sagaData as SagaData;
      setData(typedData);
    } catch (error) {
      console.error('Error loading saga data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Story', href: '/story' },
    { label: 'Campaign Saga', href: '/story/saga' }
  ];

  const handlePageChange = (page: number) => {
    // Implement page progress tracking if needed
    console.log('Page changed:', page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <Typography>Loading saga...</Typography>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <Typography color="error">
            Error loading saga content. Please try again later.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography variant="body-sm" color="secondary" className="hidden md:block">
              Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
            </Typography>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate('/story')}
            startIcon={<Book />}
          >
            Back to Selection
          </Button>
        </div>

        {/* Book Viewer */}
        <div className="max-w-4xl mx-auto">
          <BookViewer
            content={data.content}
            title={data.title}
            onPageChange={handlePageChange}
            // Disable chapter navigation since it's one continuous story
            hasNextChapter={false}
            hasPreviousChapter={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SagaPage;