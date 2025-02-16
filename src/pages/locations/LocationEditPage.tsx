// src/pages/locations/LocationEditPage.tsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '../../components/core/Typography';
import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import LocationEditForm from '../../components/features/locations/LocationEditForm';
import { useLocations } from '../../context/LocationContext';
import { useFirebase } from '../../context/FirebaseContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

const LocationEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const { locations, isLoading, error } = useLocations();
  const { user } = useFirebase();
  
  const editingLocation = locations.find(location => location.id === locationId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/locations');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <Typography>Loading location data...</Typography>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <Typography color="error">
            Error loading location data. Please try again later.
          </Typography>
        </Card>
      </div>
    );
  }

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
        <Typography variant="h1">
          {editingLocation ? `Edit ${editingLocation.name}` : 'Edit Location'}
        </Typography>
      </div>

      {editingLocation ? (
        <LocationEditForm
          location={editingLocation}
          onSuccess={() => navigate('/locations')}
          onCancel={() => navigate('/locations')}
        />
      ) : (
        <Card>
          <Card.Content>
            <Typography color="error">Location not found</Typography>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default LocationEditPage;