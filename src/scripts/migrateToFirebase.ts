// src/scripts/migrateToFirebase.ts
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp2LEL7nqRmpmXXLaeyv0kB8FC0jrRuQw",
  authDomain: "dndrecap-e3913.firebaseapp.com",
  projectId: "dndrecap-e3913",
  storageBucket: "dndrecap-e3913.firebasestorage.app",
  messagingSenderId: "392483147732",
  appId: "1:392483147732:web:ad1c51052c6c122040d041",
  measurementId: "G-PXN0WPT4YD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to read JSON files
async function readJSON(path: string) {
  const filePath = join(__dirname, '../../', path);
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function migrateData() {
  try {
    // Read JSON files
    const npcData = await readJSON('src/data/npcs/npcs.json');
    const questData = await readJSON('src/data/quests/metadata/quests.json');
    const locationData = await readJSON('src/data/locations/locations.json');
    const storyData = await readJSON('src/data/story/story.json');

    // Migrate NPCs
    console.log('Migrating NPCs...');
    for (const npc of npcData.npcs) {
      await setDoc(doc(db, 'npcs', npc.id), npc);
      console.log(`Migrated NPC: ${npc.name}`);
    }

    // Migrate Quests
    console.log('Migrating Quests...');
    for (const quest of questData.quests) {
      await setDoc(doc(db, 'quests', quest.id), quest);
      console.log(`Migrated Quest: ${quest.title}`);
    }

    // Migrate Locations
    console.log('Migrating Locations...');
    for (const location of locationData.locations) {
      await setDoc(doc(db, 'locations', location.id), location);
      console.log(`Migrated Location: ${location.name}`);
    }

    // Migrate Story Chapters
    console.log('Migrating Story Chapters...');
    for (const chapter of storyData.chapters) {
      await setDoc(doc(db, 'chapters', chapter.id), chapter);
      console.log(`Migrated Chapter: ${chapter.title}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateData();