
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


