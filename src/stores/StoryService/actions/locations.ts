import type { StoryService } from '../../story';
import type { Location } from '../../../lib/types';

export async function getLocation(this: StoryService, id: string): Promise<Location | undefined> {
    return await this.db.locations.get(id);
}

export async function getLocations(this: StoryService): Promise<Location[]> {
    return await this.db.locations.toArray();
}

export async function getLocationIdList(this: StoryService): Promise<string[]> {
    return await this.db.locations.toCollection().primaryKeys();
}


export async function getLocationsByFilter(
    this: StoryService,
    filterFn: (loc: Location) => boolean
): Promise<Location[]> {
    const all = await this.db.locations.toArray();
    return all.filter(filterFn);
}

