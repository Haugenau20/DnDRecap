import React, { useState, useMemo } from 'react';
import { Location, LocationType } from '../../../types/location';
import Typography from '../../core/Typography';
import Card from '../../core/Card';
import Input from '../../core/Input';
import LocationCard from './LocationCard';
import { 
  Search, 
  Filter,
  MapPin,
  Building,
  Mountain,
  Home,
  Landmark
} from 'lucide-react';

interface LocationDirectoryProps {
  locations: Location[];
  isLoading?: boolean;
}

const LocationDirectory: React.FC<LocationDirectoryProps> = ({ 
  locations,
  isLoading = false 
}) => {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<LocationType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Location['status'] | 'all'>('all');

  // Group locations by parent to create hierarchy
  const locationHierarchy = useMemo(() => {
    return locations.reduce((acc, location) => {
      const parentId = location.parentId || 'root';
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(location);
      return acc;
    }, {} as Record<string, Location[]>);
  }, [locations]);

  // Filter locations based on search and filters
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const typeMatch = typeFilter === 'all' || location.type === typeFilter;

      // Status filter
      const statusMatch = statusFilter === 'all' || location.status === statusFilter;

      return searchMatch && typeMatch && statusMatch;
    });
  }, [locations, searchQuery, typeFilter, statusFilter]);

  // Recursive function to render location hierarchy
  const renderLocationHierarchy = (parentId: string = 'root', level: number = 0) => {
    const childLocations = locationHierarchy[parentId] || [];
    
    if (childLocations.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        {childLocations.map(location => (
          <div key={location.id} className="relative">
            {/* Connection lines for hierarchy */}
            {level > 0 && (
              <>
                <div className="absolute left-4 top-0 bottom-0 border-l-2 border-gray-200 -ml-4" />
                <div className="absolute left-4 top-6 w-4 border-t-2 border-gray-200 -ml-4" />
              </>
            )}
            <div className={`${level > 0 ? 'ml-8' : ''}`}>
              <LocationCard location={location} />
            </div>
            {renderLocationHierarchy(location.id, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <Card.Content>
          <Typography>Loading locations...</Typography>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <Card.Content className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="text-gray-400" />}
                fullWidth
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Building size={20} className="text-gray-500" />
              <select
                className="rounded border p-2"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LocationType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="region">Regions</option>
                <option value="city">Cities</option>
                <option value="town">Towns</option>
                <option value="village">Villages</option>
                <option value="dungeon">Dungeons</option>
                <option value="landmark">Landmarks</option>
                <option value="building">Buildings</option>
                <option value="poi">Points of Interest</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-gray-500" />
              <select
                className="rounded border p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Location['status'] | 'all')}
              >
                <option value="all">All Status</option>
                <option value="undiscovered">Undiscovered</option>
                <option value="discovered">Discovered</option>
                <option value="visited">Visited</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Location List */}
      {filteredLocations.length > 0 ? (
        <div className="space-y-6">
          {renderLocationHierarchy()}
        </div>
      ) : (
        <Card>
          <Card.Content className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <Typography variant="h3" className="mb-2">
              No Locations Found
            </Typography>
            <Typography color="secondary">
              {searchQuery
                ? 'No locations match your search criteria'
                : 'There are no locations to display'}
            </Typography>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default LocationDirectory;