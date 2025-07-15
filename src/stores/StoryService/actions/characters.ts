import type { Character, ScriptLineType } from '../../../lib/types';
import type { StoryService } from '../../story';

// Get a character by ID reactively
export function useCharacter(
    this: StoryService,
    id: () => string | undefined
) {
    return this.createLiveResource(() => {
        const characterId = id();
        if (!characterId) return undefined;
        return this.db.characters.get(characterId);
    });
}


export function useCharacters(this: StoryService) {
    return this.createLiveResource(() => this.db.characters.toArray());
}

export function useCharactersByFilter(
    this: StoryService,
    filterFn: () => ((char: Character) => boolean) | undefined
) {
    return this.createLiveResource(async () => {
        const fn = filterFn();
        if (!fn) return [];
        const all = await this.db.characters.toArray();
        return all.filter(fn);
    });
}

// Get characters by story ID reactively
export function useCharactersByStoryId(
    this: StoryService,
    storyId: () => string | undefined
) {
    return this.createLiveResource(() => {
        const id = storyId();
        if (!id) return [];
        return this.db.characters.where('storyId').equals(id).toArray();
    });
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

export function useCharactersNotInScene(
    this: StoryService,
    sceneId: () => string | undefined
) {
    return this.createLiveResource(async () => {
        const id = sceneId();
        if (!id) return [];

        const scene = await this.db.scenes.get(id);
        if (!scene) {
            console.warn(`Scene with id ${id} not found.`);
            return [];
        }

        const beats = await this.db.beats.bulkGet(scene.beatIds);
        const scriptLineIds = beats.flatMap(beat => beat?.scriptLineIds || []);
        const scriptlines = await this.db.scriptlines.bulkGet(scriptLineIds);

        const sceneCharacterIds = new Set(
            scriptlines
                .map(line => line?.characterId)
                .filter((cid): cid is string => !!cid)
        );

        const allCharacters = await this.db.characters.toArray();
        return allCharacters.filter(char => !sceneCharacterIds.has(char.id));
    });
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
