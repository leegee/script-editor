
import type { StoryService } from '../../story';
import type { Character, Location, Scene } from '../../../lib/types';

export async function getScene(
    this: StoryService,
    sceneId: string
): Promise<Scene | undefined> {
    return this.db.scenes.get(sceneId);
}

export async function getCharactersInSceneById(
    this: StoryService,
    sceneId: string
): Promise<Character[]> {
    return this.db.characters
        .where('sceneId')
        .equals(sceneId)
        .toArray();
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