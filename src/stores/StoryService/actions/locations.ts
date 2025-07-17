import type { LiveSignal, StoryService } from '../../story';
import type { Location } from '../../../lib/types';

export function useLocation(
    this: StoryService,
    getId: () => string
): LiveSignal<Location | undefined> {
    return this.createLiveSignal(async () => {
        return await this.db.locations.get(getId());
    });
}

export function useAllLocations(this: StoryService): LiveSignal<Location[]> {
    return this.createLiveSignal(async () => {
        return await this.db.locations.toArray();
    });
}

