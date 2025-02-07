import { useMemo } from 'react';
import questData from '../data/quests/metadata/quests.json';

export const useQuests = () => {
  const quests = useMemo(() => questData.quests, []);
  
  const getQuestById = (id: string) => {
    return quests.find(quest => quest.id === id);
  };

  return {
    quests,
    getQuestById
  };
};