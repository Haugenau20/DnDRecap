import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NPC } from '../../../types/npc';
import NPCCard from './NPCCard';
import Card from '../../core/Card';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import { Search, Users, MapPin, Heart } from 'lucide-react';

interface NPCDirectoryProps {
  npcs: NPC[];
  isLoading?: boolean;
}

const NPCDirectory: React.FC<NPCDirectoryProps> = ({ 
  npcs,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [highlightedNpcId, setHighlightedNpcId] = useState<string | null>(null);

  // Get URL search params for highlighted NPC
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const highlightId = searchParams.get('highlight');

  // Handle highlighted NPC from URL
  useEffect(() => {
    if (highlightId) {
      setHighlightedNpcId(highlightId);
      // Find the NPC and set relevant filters
      const highlightedNpc = npcs.find(npc => npc.id === highlightId);
      if (highlightedNpc) {
        if (highlightedNpc.location) {
          setLocationFilter(highlightedNpc.location);
        }
        // Scroll to the highlighted NPC card
        setTimeout(() => {
          const element = document.getElementById(`npc-${highlightId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [highlightId, npcs]);

  // Get unique locations for filter dropdown
  const locations = useMemo(() => {
    const uniqueLocations = new Set(npcs.map(npc => npc.location).filter(Boolean));
    return Array.from(uniqueLocations);
  }, [npcs]);

  // Filter NPCs based on search and filters
  const filteredNPCs = useMemo(() => {
    return npcs.filter(npc => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        npc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        npc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (npc.title && npc.title.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const statusMatch = statusFilter === 'all' || npc.status === statusFilter;

      // Relationship filter
      const relationshipMatch = relationshipFilter === 'all' || 
        npc.relationship === relationshipFilter;

      // Location filter
      const locationMatch = locationFilter === 'all' || npc.location === locationFilter;

      return searchMatch && statusMatch && relationshipMatch && locationMatch;
    });
  }, [npcs, searchQuery, statusFilter, relationshipFilter, locationFilter]);

  // Group NPCs by location for display
  const groupedNPCs = useMemo(() => {
    return filteredNPCs.reduce((acc, npc) => {
      const location = npc.location || 'Unknown Location';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(npc);
      return acc;
    }, {} as Record<string, NPC[]>);
  }, [filteredNPCs]);

  if (isLoading) {
    return (
      <Card>
        <Card.Content>
          <Typography>Loading NPCs...</Typography>
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
                placeholder="Search NPCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="text-gray-400" />}
                fullWidth
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Users size={20} className="text-gray-500" />
              <select
                className="rounded border p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="alive">Alive</option>
                <option value="deceased">Deceased</option>
                <option value="missing">Missing</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {/* Relationship Filter */}
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-gray-500" />
              <select
                className="rounded border p-2"
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value)}
              >
                <option value="all">All Relationships</option>
                <option value="friendly">Friendly</option>
                <option value="neutral">Neutral</option>
                <option value="hostile">Hostile</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-gray-500" />
              <select
                className="rounded border p-2"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* NPC List */}
      {Object.entries(groupedNPCs).map(([location, locationNPCs]) => (
        <div key={location}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-gray-500" />
            <Typography variant="h3">{location}</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationNPCs.map(npc => (
              <div
                key={npc.id}
                id={`npc-${npc.id}`}
                className={`transition-all duration-300 ${
                  highlightedNpcId === npc.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''
                }`}
              >
                <NPCCard npc={npc} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {filteredNPCs.length === 0 && (
        <Card>
          <Card.Content className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <Typography variant="h3" className="mb-2">
              No NPCs Found
            </Typography>
            <Typography color="secondary">
              Try adjusting your search criteria
            </Typography>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default NPCDirectory;