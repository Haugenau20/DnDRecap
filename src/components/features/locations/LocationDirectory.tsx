import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from '../../../types/location';
import LocationCard from './LocationCard';
import Card from '../../core/Card';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import { Search, Filter, MapPin, Building } from 'lucide-react';

interface LocationDirectoryProps {
  locations: Location[];
  isLoading?: boolean;
}

const LocationDirectory: React.FC<LocationDirectoryProps> = ({ 
  locations,
  isLoading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | null>(null);

  // Get URL search params for highlighted location
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const highlightId = searchParams.get('highlight');

  // Function to get all parent location IDs for a given location
  const getParentLocationIds = (locationId: string): string[] => {
    const parentIds: string[] = [];
    let currentLocation = locations.find(loc => loc.id === locationId);
    
    while (currentLocation?.parentId) {
      parentIds.push(currentLocation.parentId);
      currentLocation = locations.find(loc => loc.id === currentLocation?.parentId);
    }
    
    return parentIds;
  };

  // Handle highlighted location from URL
  useEffect(() => {
    if (highlightId) {
      const decodedHighlightId = decodeURIComponent(highlightId);
      
      // First try to find by ID, then by name
      const highlightedLocation = locations.find(loc => 
        loc.id === decodedHighlightId || 
        loc.name.toLowerCase() === decodedHighlightId.toLowerCase()
      );

      if (highlightedLocation) {
        setHighlightedLocationId(highlightedLocation.id);
        
        // Set relevant filters
        if (highlightedLocation.type) {
          setTypeFilter(highlightedLocation.type);
        }

        // Get and expand all parent locations
        const parentIds = getParentLocationIds(highlightedLocation.id);
        setExpandedLocations(new Set(parentIds));
        
        // Scroll to the highlighted location
        setTimeout(() => {
          const element = document.getElementById(`location-${highlightedLocation.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [highlightId, locations]);

  // Filter locations based on search and filters
  const filteredLocations = useMemo(() => {
    // First, create a set of valid location IDs based on filters
    const validLocationIds = new Set<string>();
    
    // Helper function to get all parent IDs for a location
    const getParentIds = (location: Location): string[] => {
      const parentIds: string[] = [];
      let currentLocation = location;
      while (currentLocation.parentId) {
        parentIds.push(currentLocation.parentId);
        const parent = locations.find(loc => loc.id === currentLocation.parentId);
        if (!parent) break;
        currentLocation = parent;
      }
      return parentIds;
    };

    // First pass: Find all locations that match the filters
    locations.forEach(location => {
      const searchMatch = searchQuery === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase());

      const typeMatch = typeFilter === 'all' || location.type.toLowerCase() === typeFilter.toLowerCase();

      const statusMatch = statusFilter === 'all' || location.status.toLowerCase() === statusFilter.toLowerCase();

      if (searchMatch && typeMatch && statusMatch) {
        validLocationIds.add(location.id);
        // Add all parent locations to valid IDs to maintain hierarchy
        getParentIds(location).forEach(id => validLocationIds.add(id));
      }
    });

    // Second pass: Filter locations based on the valid IDs
    return locations.filter(location => validLocationIds.has(location.id));
  }, [locations, searchQuery, typeFilter, statusFilter]);

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

  // State for expanded locations
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());

  // Toggle expansion state
  const toggleExpansion = (locationId: string) => {
    setExpandedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        // When collapsing, also remove any child locations
        const childLocations = Object.entries(locationHierarchy)
          .filter(([_, locs]) => locs.some(loc => loc.parentId === locationId))
          .map(([childId]) => childId);
        
        newSet.delete(locationId);
        childLocations.forEach(childId => newSet.delete(childId));
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  // Recursive function to render location hierarchy
  const renderLocationHierarchy = (parentId: string = 'root', level: number = 0) => {
    const childLocations = locationHierarchy[parentId] || [];
    
    if (childLocations.length === 0) {
      return null;
    }

    return (
      <div className="space-y-6">
        {childLocations.map(location => {
          const hasChildren = locationHierarchy[location.id]?.length > 0;
          const isExpanded = expandedLocations.has(location.id);

          return (
            <div key={location.id} className="relative">
              {/* Connection lines for hierarchy */}
              {level > 0 && (
                <>
                  <div 
                    className="absolute border-l-2 border-gray-200" 
                    style={{ 
                      left: `${level}rem`,
                      top: '0',
                      bottom: '0',
                      marginLeft: '-1px'
                    }}
                  />
                  <div 
                    className="absolute border-t-2 border-gray-200"
                    style={{ 
                      left: `${level}rem`,
                      width: '1rem',
                      top: '1.5rem',
                      marginLeft: '-1px'
                    }}
                  />
                </>
              )}
              <div style={{ marginLeft: level > 0 ? `${level * 2}rem` : '0' }}>
                <div
                  id={`location-${location.id}`}
                  className={`transition-all duration-300 ${
                    highlightedLocationId === location.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''
                  }`}
                >
                  <LocationCard 
                    location={location}
                    hasChildren={hasChildren}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleExpansion(location.id)}
                  />
                </div>
              </div>
              {/* Render children if expanded */}
              {isExpanded && (
                <div className="mt-6">
                  {renderLocationHierarchy(location.id, level + 1)}
                </div>
              )}
            </div>
          );
        })}
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
                onChange={(e) => setTypeFilter(e.target.value)}
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
                onChange={(e) => setStatusFilter(e.target.value)}
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