import type { Character, ScriptLineType } from '../../../lib/types';
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

export async function removeCharacterFromScene(sceneId: string, characterId: string): Promise<void> {
    const scene = await this.db.scenes.get(sceneId);
    if (!scene) {
        console.warn(`Scene with id ${sceneId} not found.`);
        return;
    }

    const existing = scene.characterIds ?? [];

    const listWithoutChar = existing.filter(id => id !== characterId);

    await this.db.scenes.put({
        ...scene,
        characterIds: listWithoutChar,
    });
}

export async function getCharactersNotInScene(
    this: StoryService,
    sceneId: string
): Promise<Character[]> {
    const scene = await this.db.scenes.get(sceneId);
    if (!scene) {
        console.warn(`Scene with id ${sceneId} not found.`);
        return [];
    }

    const beats = await this.db.beats.bulkGet(scene.beatIds);
    const scriptLineIds = beats.flatMap(beat => beat?.scriptLineIds || []);
    const scriptlines = await this.db.scriptlines.bulkGet(scriptLineIds);

    const sceneCharacterIds = new Set(
        scriptlines
            .map(line => line?.characterId)
            .filter((id): id is string => !!id)
    );

    const allCharacters = await this.db.characters.toArray();
    const notInScene = allCharacters.filter(char => !sceneCharacterIds.has(char.id));

    return notInScene;
}


export async function linkCharacterToScene(
    this: StoryService,
    sceneId: string,
    characterId: string
): Promise<void> {
    const scene = await this.db.scenes.get(sceneId);
    if (!scene) {
        throw new Error(`Scene with id ${sceneId} not found`);
    }

    const beatId = scene.beatIds[0];
    if (!beatId) {
        throw new Error(`Scene ${sceneId} has no beats to link character to`);
    }

    const beat = await this.db.beats.get(beatId);
    if (!beat) {
        throw new Error(`Beat with id ${beatId} not found`);
    }

    const newScriptLineId = crypto.randomUUID();

    const newScriptLine = {
        id: newScriptLineId,
        type: 'Dialogue' as ScriptLineType,
        characterId,
        text: '',
    };

    await this.db.scriptlines.put(newScriptLine);

    beat.scriptLineIds.push(newScriptLineId);

    await this.db.beats.put(beat);
}
