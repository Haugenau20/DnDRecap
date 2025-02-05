// context/NPCContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NPC, NPCContextValue, NPCContextState, NPCRelationship, NPCNote } from '../types/npc';

// Import NPC data
import npcData from '../data/npcs/npcs.json';

const NPCContext = createContext<NPCContextValue | undefined>(undefined);

export const NPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NPCContextState>({
    npcs: [],
    isLoading: true,
    error: null,
  });

  // Load NPC data
  useEffect(() => {
    try {
      setState({
        npcs: npcData.npcs as NPC[],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load NPC data',
      }));
    }
  }, []);

  // Get NPC by ID
  const getNPCById = (id: string) => {
    return state.npcs.find(npc => npc.id === id);
  };

  // Get NPCs by quest
  const getNPCsByQuest = (questId: string) => {
    return state.npcs.filter(npc => 
      npc.connections.relatedQuests.includes(questId)
    );
  };

  // Get NPCs by location
  const getNPCsByLocation = (location: string) => {
    return state.npcs.filter(npc => 
      npc.location?.toLowerCase() === location.toLowerCase()
    );
  };

  // Get NPCs by relationship
  const getNPCsByRelationship = (relationship: NPCRelationship) => {
    return state.npcs.filter(npc => 
      npc.relationship === relationship
    );
  };

  // Update NPC note
  const updateNPCNote = (npcId: string, note: NPCNote) => {
    setState(prev => ({
      ...prev,
      npcs: prev.npcs.map(npc => 
        npc.id === npcId
          ? { ...npc, notes: [...npc.notes, note] }
          : npc
      ),
    }));
  };

  // Update NPC relationship
  const updateNPCRelationship = (npcId: string, relationship: NPCRelationship) => {
    setState(prev => ({
      ...prev,
      npcs: prev.npcs.map(npc =>
        npc.id === npcId
          ? { ...npc, relationship }
          : npc
      ),
    }));
  };

  const value: NPCContextValue = {
    ...state,
    getNPCById,
    getNPCsByQuest,
    getNPCsByLocation,
    getNPCsByRelationship,
    updateNPCNote,
    updateNPCRelationship,
  };

  return (
    <NPCContext.Provider value={value}>
      {children}
    </NPCContext.Provider>
  );
};

export const useNPCs = () => {
  const context = useContext(NPCContext);
  if (context === undefined) {
    throw new Error('useNPCs must be used within an NPCProvider');
  }
  return context;
};