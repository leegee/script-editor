import type { LiveSignal, StoryService } from '../../story';
import type { Beat } from '../../../lib/types';

export function useBeat(beatId: () => string | undefined): LiveSignal<Beat | undefined> {
    return this.createLiveResource(() => {
        if (!beatId()) return undefined;
        return this.db.beats.get(beatId());
    });
}

export function getBeatsBySceneId(
    this: StoryService,
    sceneId: string
): LiveSignal<Beat[]> {
    return this.createLiveSignal(async () => {
        const scene = await this.db.scenes.get(sceneId);
        if (!scene) return undefined;

        const beats = await Promise.all(scene.beatIds.map(id => this.db.beats.get(id)));

        return beats.filter((beat): beat is Beat => beat !== undefined);
    });
}

