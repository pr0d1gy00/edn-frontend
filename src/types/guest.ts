// Re-export Guest from episode types for consistency
// Both guest and episode modules share the same Guest shape
export type { Guest } from './episode';

export interface CreateGuestInput {
  name: string;
  bio?: string;
  twitterHandle?: string;
  instagramHandle?: string;
}

export interface UpdateGuestInput extends Partial<CreateGuestInput> {}
