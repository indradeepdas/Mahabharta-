export interface StoryPanel {
  id: string;
  title: string;
  visualDescription: string;
  narration: string;
  sourceReference: string;
  imageUrl?: string;
  isLoadingImage?: boolean;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  color: string;
  storyCount: number;
}

export interface StoryEpisode {
  title: string;
  tagline: string;
  prompt: string;
}

export interface CharacterStories {
  character: Character;
  stories: StoryEpisode[];
}

export interface StoryboardState {
  panels: StoryPanel[];
  sceneDescription: string;
  bookContext: string | null;
  isProcessing: boolean;
  error: string | null;
  selectedCharacterId?: string;
  // This is our central "Saved" database for the current book
  characterIndex: Record<string, CharacterStories>;
  storyboardCache: Record<string, StoryPanel[]>;
  discoveryProgress: number; // 0 to 100
}

export interface RetrievalResponse {
  found: boolean;
  panels?: Omit<StoryPanel, 'id' | 'imageUrl' | 'isLoadingImage'>[];
  reason?: string;
}

export interface DiscoveryResponse {
  characters: (Omit<Character, 'storyCount'> & { stories: StoryEpisode[] })[];
}

export enum AppState {
  HERO,
  UPLOAD,
  INDEXING, // New state for one-time creation
  CHARACTER_SELECT,
  STORY_SELECT,
  GENERATING,
  VIEW
}
