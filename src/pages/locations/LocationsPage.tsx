// src/pages/locations/LocationsPage.tsx
import React, { useState, useMemo } from 'react';
import Typography from '../../components/core/Typography';
import Card from '../../components/core/Card';
import LocationDirectory from '../../components/features/locations/LocationDirectory';
import SignInForm from '../../components/features/auth/SignInForm';
import { useFirebase } from '../../context/FirebaseContext';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Location } from '../../types/location';  // Make sure this import is present
import { Map, MapPin, Eye, EyeOff, LogIn, LogOut, Plus } from 'lucide-react';
import Button from '../../components/core/Button';
import { useNavigation } from '../../context/NavigationContext';

const LocationsPage: React.FC = () => {
  // Auth state
  const [showSignIn, setShowSignIn] = useState(false);
  const { user, signOut } = useFirebase();
  const { data: locations, loading, error } = useFirebaseData<Location>({
    collection: 'locations'
  });

  const { navigateToPage } = useNavigation();
  
  // Calculate statistics
  const stats = useMemo(() => ({
    total: locations.length,
    visited: locations.filter(loc => loc.status === 'visited').length,
    discovered: locations.filter(loc => loc.status === 'discovered').length,
    undiscovered: locations.filter(loc => loc.status === 'undiscovered').length
  }), [locations]);

  // Handle sign in success
  const handleSignInSuccess = () => {
    setShowSignIn(false);
  };

  // Handle create new location
  const handleCreateLocation = () => {
    navigateToPage('/locations/create');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <Card.Content className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <Typography>Loading locations...</Typography>
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <Card.Content>
            <Typography color="error">
              Error loading locations: {error}
            </Typography>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <Typography variant="h1" className="mb-2">
            Locations
          </Typography>
          <Typography color="secondary">
            Explore and track the places you've discovered in your adventures
          </Typography>
        </div>

        {/* Auth actions */}
        <div className="flex gap-2">
          {user && (
            <Button
              onClick={handleCreateLocation}
              startIcon={<Plus className="w-5 h-5" />}
            >
              Add Location
            </Button>
          )}
          {user ? (
            <Button
              variant="ghost"
              onClick={() => signOut()}
              startIcon={<LogOut className="w-5 h-5" />}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              onClick={() => setShowSignIn(true)}
              startIcon={<LogIn className="w-5 h-5" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Show Sign In Form */}
      {showSignIn && (
        <div className="mb-8">
          <SignInForm onSuccess={handleSignInSuccess} />
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <Map className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.total}
              </Typography>
              <Typography color="secondary">
                Total Locations
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <MapPin className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.visited}
              </Typography>
              <Typography color="secondary">
                Visited
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <Eye className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.discovered}
              </Typography>
              <Typography color="secondary">
                Discovered
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <EyeOff className="w-8 h-8 text-gray-400 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.undiscovered}
              </Typography>
              <Typography color="secondary">
                Undiscovered
              </Typography>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Location Directory */}
      <LocationDirectory 
        locations={locations || []} // Provide empty array as fallback
        isLoading={loading}
      />
    </div>
  );
};

export default LocationsPage;