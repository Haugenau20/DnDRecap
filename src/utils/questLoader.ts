// utils/questLoader.ts
import fs from 'fs';
import path from 'path';
import { Quest } from '../types/quest';

const QUESTS_DIR = path.join(process.cwd(), 'src/data/quests');
const METADATA_FILE = path.join(QUESTS_DIR, 'metadata/quests.json');
const CONTENT_DIR = path.join(QUESTS_DIR, 'content');

interface QuestMetadata {
  quests: Quest[];
}

/**
 * Loads all quest data, combining metadata and content files
 * This function runs at build time to generate the static content
 */
export async function loadQuests(): Promise<Quest[]> {
  // Read the metadata file
  const metadata: QuestMetadata = JSON.parse(
    fs.readFileSync(METADATA_FILE, 'utf-8')
  );

  // Load content for each quest
  const quests = await Promise.all(
    metadata.quests.map(async (quest) => {
      let content = '';

      if (quest.contentFile) {
        try {
          const contentPath = path.join(CONTENT_DIR, quest.contentFile);
          content = fs.readFileSync(contentPath, 'utf-8');
        } catch (error) {
          console.warn(`Could not load content for quest ${quest.id}:`, error);
        }
      }

      return {
        ...quest,
        content
      };
    })
  );

  return quests;
}

/**
 * Get a specific quest by ID
 */
export async function getQuestById(id: string): Promise<Quest | undefined> {
  const quests = await loadQuests();
  return quests.find(quest => quest.id === id);
}

/**
 * Get quests filtered by status
 */
export async function getQuestsByStatus(status: Quest['status']): Promise<Quest[]> {
  const quests = await loadQuests();
  return quests.filter(quest => quest.status === status);
}

/**
 * Generates the static props for the quests page
 * Use this in getStaticProps for Next.js or similar for other static site generators
 */
export async function getQuestsStaticProps() {
  const quests = await loadQuests();
  
  return {
    props: {
      quests,
      stats: {
        active: quests.filter(q => q.status === 'active').length,
        completed: quests.filter(q => q.status === 'completed').length,
        failed: quests.filter(q => q.status === 'failed').length,
      }
    }
  };
}