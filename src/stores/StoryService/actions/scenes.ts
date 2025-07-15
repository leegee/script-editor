
import type { StoryService } from '../../story';
import type { Character, Location, Scene } from '../../../lib/types';

export function useScene(
    this: StoryService,
    sceneId: () => string | undefined
) {
    return this.createLiveResource(() => {
        if (!sceneId()) return undefined;
        return this.db.scenes.get(sceneId());
    });
}

export function useCharactersInScene(
    this: StoryService,
    sceneId: () => string | undefined
) {
    return this.createLiveResource(async () => {
        const id = sceneId();
        if (!id) return undefined;

        const scene = await this.db.scenes.get(id);
        if (!scene) return undefined;

        const beats = await this.db.beats.where('id').anyOf(scene.beatIds ?? []).toArray();
        const scriptLineIds = beats.flatMap(beat => beat.scriptLineIds ?? []);
        const scriptLines = await this.db.scriptlines.where('id').anyOf(scriptLineIds).toArray();

        const characterIds = [...new Set(scriptLines.map(sl => sl.characterId).filter(Boolean))];
        const characters = await this.db.characters.where('id').anyOf(characterIds).toArray();

        return characters;
    });
}


export async function getScenesByActId(
    this: StoryService,
    actId: string
): Promise<Scene[]> {
    const acts = await this.db.acts.where('id').equals(actId).toArray();

    const sceneIds = acts
        .map(s => s.sceneIds)
        .filter(Boolean)
        .flat();

    const uniqueSceneIds = [...new Set(sceneIds)];

    return this.db.scenes.where('id').anyOf(uniqueSceneIds).toArray();
}


export async function replaceLocationInScene(
    this: StoryService,
    sceneId: string,
    locationId: string
) {
    const scene = await this.db.scenes.get(sceneId);
    if (!scene) {
        throw new Error(`Scene with ID ${sceneId} not found`);
    }

    const location = await this.db.locations.get(locationId);
    if (!location) {
        throw new Error(`Location with ID ${locationId} not found`);
    }

    await this.db.scenes.update(sceneId, { locationId });
}