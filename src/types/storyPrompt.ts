export interface StoryPrompt {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  isOpen: boolean; // voting open
  createdAt?: string;
  updatedAt?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  authorId: string;
  promptId: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Vote fields (optional - populated by API)
  _count:{
    votes: number;
  }
  score?: number;
  userVote?: 1 | -1 | 0;
}
