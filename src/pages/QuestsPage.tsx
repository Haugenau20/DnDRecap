// pages/QuestsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '../components/core/Typography';
import Card from '../components/core/Card';
import Input from '../components/core/Input';
import { Quest, QuestStatus } from '../types/quest';
import QuestCard from '../components/features/quests/QuestCard';
import { Scroll, CheckCircle2, XCircle, Filter, Search, MapPin } from 'lucide-react';

// Import and type the quest data
import rawQuestData from '../data/quests/metadata/quests.json';

// Type assertion for the imported data
interface QuestData {
  quests: Quest[];
}
const questData = rawQuestData as QuestData;

const QuestsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const highlightedQuestId = searchParams.get('highlight');

  // State for filters
  const [statusFilter, setStatusFilter] = useState<QuestStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique locations for filter dropdown
  const locations = useMemo(() => {
    const uniqueLocations = new Set(questData.quests.map(q => q.location).filter(Boolean));
    return Array.from(uniqueLocations).sort();
  }, []);

  // Calculate stats
  const stats = {
    active: questData.quests.filter(q => q.status === 'active').length,
    completed: questData.quests.filter(q => q.status === 'completed').length,
    failed: questData.quests.filter(q => q.status === 'failed').length,
  };

  // Filter quests based on status and search query
  const filteredQuests = useMemo(() => {
    return questData.quests.filter(quest => {
      // Status filter
      if (statusFilter !== 'all' && quest.status !== statusFilter) {
        return false;
      }

      // Location filter
      if (locationFilter !== 'all') {
        if (!quest.location || quest.location !== locationFilter) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        return (
          quest.title.toLowerCase().includes(search) ||
          quest.description.toLowerCase().includes(search) ||
          quest.objectives.some(obj => obj.description.toLowerCase().includes(search)) ||
          quest.relatedNPCIds?.some(npc => npc.toLowerCase().includes(search))
        );
      }

      return true;
    });
  }, [statusFilter, searchQuery]);

  // Scroll to highlighted quest when the URL changes
  useEffect(() => {
    if (highlightedQuestId) {
      const element = document.getElementById(`quest-${highlightedQuestId}`);
      if (element) {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }, 100);
      }
    }
  }, [highlightedQuestId]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <Typography variant="h1" className="mb-2">
          Campaign Quests
        </Typography>
        <Typography color="secondary">
          Track your party's epic adventures and missions
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <Scroll className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.active}
              </Typography>
              <Typography color="secondary">
                Active Quests
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <CheckCircle2 className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.completed}
              </Typography>
              <Typography color="secondary">
                Completed
              </Typography>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-center p-6">
            <XCircle className="w-8 h-8 text-red-500 mr-4" />
            <div>
              <Typography variant="h2" className="mb-1">
                {stats.failed}
              </Typography>
              <Typography color="secondary">
                Failed
              </Typography>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <Card.Content className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 w-full md:w-auto">
            <Input
              startIcon={<Search className="text-gray-400" />}
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <Typography variant="body-sm">Status:</Typography>
              <select
                className="rounded border p-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as QuestStatus | 'all')}
              >
                <option value="all">All Quests</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-gray-500" />
              <Typography variant="body-sm">Location:</Typography>
              <select
                className="rounded border p-1"
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

      {/* Quest List */}
      <div className="space-y-6">
        {filteredQuests.map(quest => (
          <div
            key={quest.id}
            id={`quest-${quest.id}`}
            className={`transition-all duration-300 ${
              highlightedQuestId === quest.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''
            }`}
          >
            <QuestCard quest={quest} />
          </div>
        ))}
        
        {filteredQuests.length === 0 && (
          <Card>
            <Card.Content className="text-center py-12">
              <Scroll className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <Typography variant="h3" className="mb-2">
                No Quests Found
              </Typography>
              <Typography color="secondary">
                {searchQuery
                  ? 'No quests match your search criteria'
                  : statusFilter === 'all' 
                    ? 'There are no quests to display'
                    : `No ${statusFilter} quests found`}
              </Typography>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;