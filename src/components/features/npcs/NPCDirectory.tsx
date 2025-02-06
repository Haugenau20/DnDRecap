import React, { useState, useMemo } from 'react';
import { useNPCs } from '../../../context/NPCContext';
import NPCCard from './NPCCard';
import { NPC, NPCRelationship } from '../../../types/npc';
import Card from '../../core/Card';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import {
  Search,
  Users,
  Filter,
  Heart,
  AlertCircle,
  Skull,
  HelpCircle,
  MapPin,
  Crown,
  SwordIcon,
  Shield
} from 'lucide-react';

// Status icon mapping
const statusIcons: Record<string, React.ReactNode> = {
  active: <Shield className="text-green-500" size={16} />,
  deceased: <Skull className="text-gray-500" size={16} />,
  missing: <AlertCircle className="text-yellow-500" size={16} />,
  unknown: <HelpCircle className="text-gray-400" size={16} />
};

// Relationship icon mapping
const relationshipIcons: Record<NPCRelationship, React.ReactNode> = {
  friendly: <Heart className="text-green-500" size={16} />,
  neutral: <Shield className="text-gray-500" size={16} />,
  hostile: <SwordIcon className="text-red-500" size={16} />,
  unknown: <HelpCircle className="text-gray-400" size={16} />
};

const NPCDirectory: React.FC = () => {
  const { npcs, isLoading, updateNPCRelationship } = useNPCs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

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
        npc.description.toLowerCase().includes(searchQuery.toLowerCase());

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

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  className="rounded border p-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="deceased">Deceased</option>
                  <option value="missing">Missing</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

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
              <NPCCard 
                key={npc.id}
                npc={npc}
                onUpdateRelationship={(id, relationship) => {
                  // Handle relationship update
                  if (updateNPCRelationship) {
                    updateNPCRelationship(id, relationship);
                  }
                }}
              />
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