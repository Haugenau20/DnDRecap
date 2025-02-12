import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '../components/core/Typography';
import Button from '../components/core/Button';
import Card from '../components/core/Card';
import NPCDirectory from '../components/features/npcs/NPCDirectory';
import NPCForm from '../components/features/npcs/NPCForm';
import NPCEditForm from '../components/features/npcs/NPCEditForm';
import SignInForm from '../components/features/auth/SignInForm';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { NPC } from '../types/npc';
import { Plus, Users, Loader2, ArrowLeft, LogOut } from 'lucide-react';

const NPCsPage: React.FC = () => {
  // State
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [npcs, setNpcs] = useState<NPC[]>([]);

  // Hooks
  const { user, signOut } = useFirebase();
  const { getData, loading, error } = useFirebaseData<NPC>({ collection: 'npcs' });
  const navigate = useNavigate();
  const { npcId } = useParams<{ npcId?: string }>();

  // Find NPC being edited if we're on the edit route
  const editingNPC = useMemo(() => {
    if (!npcId) return undefined;
    return npcs.find(npc => npc.id === npcId);
  }, [npcId, npcs]);

  // Calculate stats for display
  const stats = useMemo(() => ({
    total: npcs.length,
    alive: npcs.filter(npc => npc.status === 'alive').length,
    deceased: npcs.filter(npc => npc.status === 'deceased').length,
    missing: npcs.filter(npc => npc.status === 'missing').length
  }), [npcs]);

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

  // Handle form success (both create and edit)
  const handleFormSuccess = async () => {
    // Refresh NPC list
    const updatedData = await getData();
    setNpcs(updatedData || []);
    // Close create form if open
    setShowCreateForm(false);
    // Navigate back to main listing if in edit mode
    if (npcId) {
      navigate('/npcs');
    }
  };

  // Handle sign in success
  const handleSignInSuccess = () => {
    setShowSignIn(false);
  };

  // Show loading state
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

  // Show error state
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

  // If we're on the edit route, show the edit form
  if (npcId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/npcs')}
            startIcon={<ArrowLeft />}
          >
            Back to NPCs
          </Button>
          <Typography variant="h1">
            {editingNPC ? `Edit ${editingNPC.name}` : 'Edit NPC'}
          </Typography>
        </div>

        {editingNPC ? (
          <NPCEditForm
            npc={editingNPC}
            mode="edit"
            onSuccess={handleFormSuccess}
            onCancel={() => navigate('/npcs')}
            existingNPCs={npcs}
          />
        ) : (
          <Card>
            <Card.Content>
              <Typography color="error">NPC not found</Typography>
            </Card.Content>
          </Card>
        )}
      </div>
    );
  }

  // Main NPCs page
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
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              startIcon={<Plus className="w-5 h-5" />}
            >
              Add NPC
            </Button>
            <Button
              variant="ghost"
              onClick={() => signOut()}
              startIcon={<LogOut className="w-5 h-5" />}
            >
              Sign Out
            </Button>
          </div>
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

      {/* Create NPC Form Modal */}
      {showCreateForm && (
        <NPCForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowCreateForm(false)}
          existingNPCs={npcs}
        />
      )}

      {/* NPC Directory */}
      <NPCDirectory 
        npcs={npcs}
        onNPCUpdate={(updatedNPC: NPC) => {
          setNpcs(prev => prev.map(npc => 
            npc.id === updatedNPC.id ? updatedNPC : npc
          ));
        }}
      />
    </div>
  );
};

export default NPCsPage;