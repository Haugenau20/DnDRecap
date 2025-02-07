import React, { useMemo } from 'react';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import LocationDirectory from '../components/features/locations/LocationDirectory';
import { useLocations } from '../context/LocationContext';
import { MapPin, Eye, EyeOff } from 'lucide-react';

const LocationsPage: React.FC = () => {
  const { locations, isLoading } = useLocations();

  // Calculate statistics
  const stats = useMemo(() => ({
    total: locations.length,
    visited: locations.filter(loc => loc.status === 'visited').length,
    discovered: locations.filter(loc => loc.status === 'discovered').length,
    undiscovered: locations.filter(loc => loc.status === 'undiscovered').length
  }), [locations]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <Typography variant="h1" className="mb-2">
          Locations
        </Typography>
        <Typography color="secondary">
          Explore and track the places you've discovered in your adventures
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <MapPin className="w-8 h-8 text-blue-500 mr-4" />
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
        locations={locations}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LocationsPage;