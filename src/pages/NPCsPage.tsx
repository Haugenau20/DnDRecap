import React, { useState, useEffect, useMemo } from 'react';
import Typography from '../components/core/Typography';
import Button from '../components/core/Button';
import Card from '../components/core/Card';
import NPCDirectory from '../components/features/npcs/NPCDirectory';
import NPCForm from '../components/features/npcs/NPCForm';
import NPCLegend from '../components/features/npcs/NPCLegend';
import SignInForm from '../components/features/auth/SignInForm';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseData } from '../hooks/useFirebaseData';
import buildConfig from '../config/buildConfig';
import { NPC } from '../types/npc';

const NPCsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useFirebase();
  const { getData, loading, error } = useFirebaseData<NPC>({
    collection: 'npcs'
  });

  // State to store NPCs
  const [npcs, setNpcs] = useState<NPC[]>([]);

  // Fetch NPCs when component mounts
  useEffect(() => {
    const fetchNPCs = async () => {
      try {
        const data = await getData();
        setNpcs(data || []);
      } catch (err) {
        console.error('Error fetching NPCs:', err);
      }
    };

    fetchNPCs();
  }, [getData]);

  // Calculate statistics for display
  const stats = useMemo(() => ({
    total: npcs.length,
    alive: npcs.filter(npc => npc.status === 'alive').length,
    deceased: npcs.filter(npc => npc.status === 'deceased').length,
    missing: npcs.filter(npc => npc.status === 'missing').length
  }), [npcs]);

  const handleFormSuccess = async () => {
    setShowForm(false);
    // Refresh NPC list
    const updatedData = await getData();
    setNpcs(updatedData || []);
  };

  const handleSignInSuccess = () => {
    setShowSignIn(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <Typography>Loading NPCs...</Typography>
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
            Error loading NPCs. Please try again later.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Typography variant="h1" className="mb-2">
            NPC Directory
          </Typography>
          <Typography color="secondary">
            Keep track of all the characters you've met in your adventures
          </Typography>
        </div>

        {/* Show different buttons based on auth state */}
        {user ? (
          <Button
            onClick={() => setShowForm(true)}
            startIcon={<Plus className="w-5 h-5" />}
          >
            Add NPC
          </Button>
        ) : (
          <Button
            onClick={() => setShowSignIn(true)}
            startIcon={<Users className="w-5 h-5" />}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Show Sign In Form */}
      {showSignIn && (
        <div className="mb-8">
          <SignInForm onSuccess={handleSignInSuccess} />
        </div>
      )}

      {/* NPC Form or Directory */}
      {showForm ? (
        <div className="mb-8">
          {/* Form Title */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <Typography variant="h2">Create New NPC</Typography>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>

          {/* NPC Creation Form */}
          <NPCForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          {/* NPC Legend - only show if enabled in config */}
          {buildConfig.features.showNPCLegend && (
            <div className="mb-6">
              <NPCLegend />
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <Card.Content className="flex items-center justify-center p-6">
                <Users className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <Typography variant="h2" className="mb-1">
                    {stats.total}
                  </Typography>
                  <Typography color="secondary">
                    Total NPCs
                  </Typography>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center justify-center p-6">
                <Users className="w-8 h-8 text-green-500 mr-4" />
                <div>
                  <Typography variant="h2" className="mb-1">
                    {stats.alive}
                  </Typography>
                  <Typography color="secondary">
                    Alive
                  </Typography>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center justify-center p-6">
                <Users className="w-8 h-8 text-red-500 mr-4" />
                <div>
                  <Typography variant="h2" className="mb-1">
                    {stats.deceased}
                  </Typography>
                  <Typography color="secondary">
                    Deceased
                  </Typography>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center justify-center p-6">
                <Users className="w-8 h-8 text-yellow-500 mr-4" />
                <div>
                  <Typography variant="h2" className="mb-1">
                    {stats.missing}
                  </Typography>
                  <Typography color="secondary">
                    Missing
                  </Typography>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* NPC Directory */}
          <NPCDirectory npcs={npcs} />
        </>
      )}
    </div>
  );
};

export default NPCsPage;