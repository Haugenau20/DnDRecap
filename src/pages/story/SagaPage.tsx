// src/pages/story/SagaPage.tsx
import React, { useState, useEffect } from 'react';
import BookViewer from '../../components/features/story/BookViewer';
import Typography from '../../components/core/Typography';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import { Book, Loader2 } from 'lucide-react';
import { SagaData } from '../../types/saga';
import { useNavigation } from '../../context/NavigationContext';
import FirebaseService from '../../services/firebase/FirebaseService';

const SagaPage: React.FC = () => {
  const { navigateToPage } = useNavigation();
  const [data, setData] = useState<SagaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saga data
  useEffect(() => {
    const fetchSaga = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const firebaseService = FirebaseService.getInstance();
        const sagaData = await firebaseService.getDocument<SagaData>('saga', 'sagaData');
        
        if (sagaData) {
          setData(sagaData);
        } else {
          setError('Saga content not found');
        }
      } catch (err) {
        console.error('Error loading saga:', err);
        setError('Error Loading Saga. Sign in to view content.');
      } finally {
        setLoading(false);
      }
    };

    fetchSaga();
  }, []);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Story', href: '/story' },
    { label: 'Campaign Saga' }
  ];

  const handlePageChange = (page: number) => {
    // Implement page progress tracking if needed
    console.log('Page changed:', page);
  };

  // Loading state
  if (loading) {
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

  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <Typography color="error">
            {error || 'Error loading saga content. Please try again later.'}
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Typography variant="body-sm" color="secondary" className="hidden md:block">
              Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-uk', { year: 'numeric', day: '2-digit', month: '2-digit'})}
            </Typography>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigateToPage('/story')}
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