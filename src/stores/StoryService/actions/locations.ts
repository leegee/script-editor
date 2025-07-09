import type { StoryService } from '../../story';
import type { Location } from '../../../lib/types';

// Get a location by ID
export async function getLocation(this: StoryService, id: string): Promise<Location | undefined> {
    return await this.db.locations.get(id);
}

// Get all locations
export async function getLocations(this: StoryService): Promise<Location[]> {
    return await this.db.locations.toArray();
}

// Get locations by a predicate function
export async function getLocationsByFilter(
    this: StoryService,
    filterFn: (loc: Location) => boolean
): Promise<Location[]> {
    const all = await this.db.locations.toArray();
    return all.filter(filterFn);
}

