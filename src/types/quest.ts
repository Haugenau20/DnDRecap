// types/quest.ts
export type QuestStatus = 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string; // Short summary
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards?: string[];
  relatedNPCs?: string[];
  location?: string;
  levelRange?: string;
  dateAdded?: string;
  dateCompleted?: string;
  contentFile: string; // Now required
  content?: string;   // The loaded markdown content
}