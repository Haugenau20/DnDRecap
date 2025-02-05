// types/npc.ts
export type NPCRelationship = 'friendly' | 'neutral' | 'hostile';

export interface NPC {
  id: string;
  name: string;
  description: string;
  location: string;
  relationship: NPCRelationship;
  relatedQuests?: string[];
  notes?: string;
}