
import type { StoryService } from '../../story';
import type { Character, Location, Scene } from '../../../lib/types';

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
    const sceneIds = [...new Set(acts.map(s => s.sceneIds).filter(Boolean))];

    return this.db.scenes
        .where('id')
        .anyOf(sceneIds)
        .toArray();
}


