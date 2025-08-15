import type { LiveSignal, StoryService } from '../../story';
import type { Beat } from '../../../lib/types';

export function useBeat(beatId: () => string | undefined): LiveSignal<Beat | undefined> {
    return this.createLiveSignal(() => {
        if (!beatId()) return undefined;
        return this.db.beats.get(beatId());
    });
}

export function useBeatsBySceneId(
    this: StoryService,
    sceneId: () => string | undefined
): LiveSignal<Beat[]> {
    return this.createLiveSignal(async () => {
        const scenes = await this.db.scenes.where('id').equals(sceneId()).toArray();
        const beatIds = scenes
            .map(s => s.beatIds ?? [])
            .flat();
        const uniqueBeatIds = [...new Set(beatIds)];

        const beats = await this.db.beats.bulkGet(uniqueBeatIds);

        const sortedBeats = beatIds
            .map(id => beats.find(beat => beat?.id === id))
            .filter((beat): beat is Beat => beat !== undefined);

        return sortedBeats;
    });
}


export async function addNewBeatToScene(
    this: StoryService,
    sceneId: string,
): Promise<Beat> {
    const newId = crypto.randomUUID();

    const newBeat: Beat = {
        id: newId,
        title: `Untitled beat`,
        summary: '',
        scriptLineIds: [],
        plotIds: [],
    };

    await this.createEntity('beats', newBeat, sceneId);

    return newBeat;
}