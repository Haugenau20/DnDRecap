// src/pages/locations/LocationCreatePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import LocationCreateForm from '../../components/features/locations/LocationCreateForm';
import { useFirebase } from '../../context/FirebaseContext';
import { ArrowLeft } from 'lucide-react';

const LocationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useFirebase();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/locations');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/locations')}
          startIcon={<ArrowLeft />}
        >
          Back to Locations
        </Button>
        <Typography variant="h1">Create New Location</Typography>
      </div>

      <LocationCreateForm
        onSuccess={() => navigate('/locations')}
        onCancel={() => navigate('/locations')}
      />
    </div>
  );
};

export default LocationCreatePage;