// types/quest.ts
export type QuestStatus = 'active' | 'completed' | 'failed';

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  rewards?: string[];
  relatedNPCs?: string[];
  objectives: QuestObjective[];
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}