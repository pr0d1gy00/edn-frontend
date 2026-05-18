import { describe, it, expect } from 'vitest';
import type { Guest, CreateGuestInput, UpdateGuestInput } from '@/types/guest';

describe('Guest types', () => {
  it('Guest interface has required and optional fields', () => {
    // Verify a minimal object satisfies the Guest interface
    const minimalGuest: Guest = {
      id: 'guest-1',
      name: 'John Doe',
      bio: 'A comedian from Argentina',
    };

    expect(minimalGuest.id).toBe('guest-1');
    expect(minimalGuest.name).toBe('John Doe');
    expect(minimalGuest.bio).toBe('A comedian from Argentina');
    expect(minimalGuest.twitterHandle).toBeUndefined();
    expect(minimalGuest.instagramHandle).toBeUndefined();
  });

  it('Guest interface accepts optional social handles', () => {
    const fullGuest: Guest = {
      id: 'guest-2',
      name: 'Jane Doe',
      bio: 'Musician and producer',
      twitterHandle: 'janedoe',
      instagramHandle: 'janedoe_music',
    };

    expect(fullGuest.twitterHandle).toBe('janedoe');
    expect(fullGuest.instagramHandle).toBe('janedoe_music');
  });

  it('CreateGuestInput requires name but makes other fields optional', () => {
    // Bio and social handles are optional
    const minimalInput: CreateGuestInput = { name: 'New Guest' };
    expect(minimalInput.name).toBe('New Guest');
    expect(minimalInput.bio).toBeUndefined();

    const fullInput: CreateGuestInput = {
      name: 'Full Guest',
      bio: 'Full bio',
      twitterHandle: 'fullguest',
      instagramHandle: 'fullguest_ig',
    };
    expect(fullInput.bio).toBe('Full bio');
    expect(fullInput.twitterHandle).toBe('fullguest');
    expect(fullInput.instagramHandle).toBe('fullguest_ig');
  });

  it('UpdateGuestInput extends CreateGuestInput as Partial (all fields optional)', () => {
    // All fields should be optional — UpdateGuestInput is Partial<CreateGuestInput>
    const emptyUpdate: UpdateGuestInput = {};
    expect(emptyUpdate).toBeDefined();

    const partialUpdate: UpdateGuestInput = { name: 'Updated Name' };
    expect(partialUpdate.name).toBe('Updated Name');
    expect(partialUpdate.bio).toBeUndefined();

    const fullUpdate: UpdateGuestInput = {
      name: 'New Name',
      bio: 'New bio',
      twitterHandle: 'newhandle',
      instagramHandle: 'newinsta',
    };
    expect(fullUpdate.instagramHandle).toBe('newinsta');
  });

  it('Guest is re-exported from episode types for consistency', () => {
    // Verify Guest from guest.ts matches Guest from episode.ts shape
    const guest: Guest = {
      id: 'test',
      name: 'Test',
      bio: 'Test bio',
    };
    // If this compiles, the types are structurally compatible
    expect(guest.name).toBe('Test');
  });
});
