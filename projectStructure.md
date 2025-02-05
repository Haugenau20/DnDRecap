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
│   │   └── npcs/
│   │       ├── NPCDirectory.tsx
│   │       └── NPCCard.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       └── ErrorBoundary.tsx
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
│   ├── story.ts
|   ├── search.ts
│   ├── quest.ts
│   └── npc.ts
├── utils/
│   ├── search.ts
│   └── navigation.ts
├── styles/
│   └── globals.css
├── App.tsx
└── index.tsx