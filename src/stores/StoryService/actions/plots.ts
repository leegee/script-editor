import type { LiveSignal, StoryService } from '../../story';
import type { Location } from '../../../lib/types';

export function usePlot(
    this: StoryService,
    getId: () => string
): LiveSignal<Location | undefined> {
    return this.createLiveSignal(async () => {
        return await this.db.plots.get(getId());
    });
}

export function useAllPlots(this: StoryService): LiveSignal<Location[]> {
    return this.createLiveSignal(async () => {
        return await this.db.plots.toArray();
    });
}

