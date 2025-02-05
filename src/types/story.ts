// types/story.ts
export interface Chapter {
    id: string;
    title: string;
    content: string;
    order: number;
  }
  
  export interface StoryProgress {
    currentChapter: string;
    lastRead: Date;
  }
  
  export interface TableOfContents {
    chapters: Chapter[];
    currentChapter?: string;
  }