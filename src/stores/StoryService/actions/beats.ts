import type { LiveSignal, StoryService } from '../../story';
import type { Beat } from '../../../lib/types';

export function useBeat(beatId: () => string | undefined): LiveSignal<Beat | undefined> {
    return this.createLiveSignal(() => {
        if (!beatId()) return undefined;
        return this.db.beats.get(beatId());
    });
}

export function useBeatsBySceneId(this: StoryService, sceneId: () => string | undefined): LiveSignal<Beat[]> {
    return this.createLiveSignal(async () => {
        const id = sceneId();
        if (!id) return [];

        const scene = await this.db.scenes.get(id);
        if (!scene || scene.beatIds.length === 0) return [];

        const beats = await this.db.beats.bulkGet(scene.beatIds);

        // Filter out potential undef
        return beats.filter((b): b is Beat => !!b);
    });
}


export async function addNewBeatToScene(
    this: StoryService,
    sceneId: string,
): Promise<Beat> {
    const newId = crypto.randomUUID();
    const number = await this.getNextInSequence('beats');

    const newBeat: Beat = {
        id: newId,
        number,
        title: `Beat ${number}`,
        summary: '',
        scriptLineIds: [],
        plotIds: [],
    };

    await this.createEntity('beats', newBeat, sceneId);

    return newBeat;
}