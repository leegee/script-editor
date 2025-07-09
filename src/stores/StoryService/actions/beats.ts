import type { StoryService } from '../../story';
import type { Beat } from '../../../lib/types';

export async function getBeat(this: StoryService, beatId: string): Promise<Beat | undefined> {
    return await this.db.beats.get(beatId);
}

export async function getBeatsBySceneId(
    this: StoryService,
    sceneId: string
): Promise<Beat[] | undefined> {
    const scene = await this.db.scenes.get(sceneId);
    if (!scene) return undefined;

    const beats = await Promise.all(scene.beatIds.map(id => this.db.beats.get(id)));

    return beats.filter((beat): beat is Beat => beat !== undefined);
}

