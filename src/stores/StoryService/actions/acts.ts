import type { StoryService } from '../../story';
import type { Act, Character, Location } from '../../../lib/types';

// Note: we declare `this: StoryService` to get correct typing and context
export async function getAct(
    this: StoryService,
    actId: string
): Promise<Act | undefined> {
    return this.db.acts.get(actId);
}

export async function getActs(
    this: StoryService
): Promise<Act[]> {
    return this.db.acts.toArray();
}

export async function getCharactersInActById(
    this: StoryService,
    actId: string
): Promise<Character[]> {
    const acts = await this.db.acts.where('id').equals(actId).toArray();
    const sceneIds = acts.map(s => s.id);

    const beats = await this.db.beats
        .where('sceneId')
        .anyOf(sceneIds)
        .toArray();

    const beatIds = beats.map(b => b.id);

    // get scriptlines by beatIds
    const scriptLines = await this.db.scriptlines
        .where('beatId')
        .anyOf(beatIds)
        .toArray();

    const characterIds = [...new Set(scriptLines.map(sl => sl.characterId))];

    return this.db.characters
        .where('id')
        .anyOf(characterIds)
        .toArray();
}

export async function getLocationsForAct(
    this: StoryService,
    actId: string
): Promise<Location[]> {
    const act = await this.db.acts.get(actId);
    if (!act) return [];

    const scenes = await this.db.scenes
        .where('id')
        .anyOf(act.sceneIds)
        .toArray();

    const locationIds = [...new Set(scenes.map(s => s.locationId).filter(Boolean))];

    return this.db.locations
        .where('id')
        .anyOf(locationIds)
        .toArray();
}



export async function getLocationForScene(
    this: StoryService,
    sceneId: string
): Promise<Location[]> {
    const scenes = await this.db.scenes.where('sceneId').equals(sceneId).toArray();
    const locationIds = [...new Set(scenes.map(s => s.locationId).filter(Boolean))];

    return this.db.locations
        .where('id')
        .anyOf(locationIds)
        .toArray();
}

