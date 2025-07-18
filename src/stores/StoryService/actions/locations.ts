import type { LiveSignal, StoryService } from '../../story';
import type { Location } from '../../../lib/types';

export function useLocation(
    this: StoryService,
    getId: () => string
): LiveSignal<Location | undefined> {
    return this.createLiveSignal(async () => {
        const id = getId();
        if (!id) return undefined;
        return await this.db.locations.get(id);
    });
}

export function useAllLocations(this: StoryService): LiveSignal<Location[]> {
    return this.createLiveSignal(async () => {
        return await this.db.locations.toArray();
    });
}

