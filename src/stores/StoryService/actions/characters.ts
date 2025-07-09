import type { Character } from '../../../lib/types';
import type { StoryService } from '../../story';

declare module '../../story' {
    interface StoryService {
        getCharacter(id: string): Promise<Character | undefined>;
        getCharacters(): Promise<Character[]>;
    }
}

// Get a character by ID
export async function getCharacter(
    this: StoryService,
    id: string
): Promise<Character | undefined> {
    return await this.db.characters.get(id);
}

// Get all characters
export async function getCharacters(
    this: StoryService
): Promise<Character[]> {
    return await this.db.characters.toArray();
}

// Get characters by a predicate function
export async function getCharactersByFilter(
    this: StoryService,
    filterFn: (char: Character) => boolean
): Promise<Character[]> {
    const all = await this.db.characters.toArray();
    return all.filter(filterFn);
}

// Get characters belonging to a specific story ID
export async function getCharactersByStoryId(
    this: StoryService,
    storyId: string
): Promise<Character[]> {
    return await this.db.characters.where('storyId').equals(storyId).toArray();
}
