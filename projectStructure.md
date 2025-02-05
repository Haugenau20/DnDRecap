src/
├── components/
│   ├── core/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Typography.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── features/
│   │   ├── story/
│   │   │   ├── StoryViewer.tsx
│   │   │   ├── ChapterNavigation.tsx
│   │   │   └── TableOfContents.tsx
│   │   ├── quests/
│   │   │   ├── QuestTracker.tsx
│   │   │   └── QuestCard.tsx
|   |   ├── locqations/
│   │   └── npcs/
│   │       ├── NPCDirectory.tsx
│   │       └── NPCCard.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       └── ErrorBoundary.tsx
├── data/
│   └── quests/
│       ├── content/
|       │   ├── goblin-troubles.md
│       │   └── missing-merchant.md
│       └── metadata/
|           └── quests.json
├── context/
│   ├── NavigationContext.tsx
│   └── SearchContext.tsx
├── hooks/
│   ├── useSearch.ts
│   └── useNavigation.ts
├── pages/
│   ├── HomePage.tsx
│   ├── StoryPage.tsx
│   ├── QuestsPage.tsx
|   ├── LocationsPage.tsx
│   └── NPCsPage.tsx
├── types/
|   ├── locatoins.ts
|   ├──declarations.d.ts
│   ├── story.ts
|   ├── search.ts
│   ├── quest.ts
│   └── npc.ts
├── utils/
│   ├── search.ts
|   ├── questLoader.ts
│   └── navigation.ts
├── styles/
│   └── globals.css
├── App.tsx
└── index.tsx