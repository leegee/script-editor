import type { LiveSignal, StoryService } from '../../story';
import type { Beat } from '../../../lib/types';

export function useBeat(beatId: () => string | undefined): LiveSignal<Beat | undefined> {
    return this.createLiveResource(() => {
        if (!beatId()) return undefined;
        return this.db.beats.get(beatId());
    });
}
