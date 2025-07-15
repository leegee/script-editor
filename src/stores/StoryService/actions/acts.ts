import type { StoryService } from '../../story';
import type { Act, Character, Location } from '../../../lib/types';

export function useAct(
    this: StoryService,
    actId: string
) {
    return this.createLiveResource(() => this.db.acts.get(actId));
}

export function useActs(
    this: StoryService,
) {
    return this.createLiveResource(() => this.db.acts.toArray());
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


export function useCharactersInActById(
    this: StoryService,
    actId: () => string | undefined
) {
    return this.createLiveResource(async () => {
        const id = actId();
        if (!id) return [];

        const act = await this.db.acts.get(id);
        if (!act) {
            console.warn(`Act with id ${id} not found.`);
            return [];
        }

        const sceneIds = act.sceneIds;
        if (sceneIds.length === 0) return [];

        const scenes = await this.db.scenes
            .where('id')
            .anyOf(sceneIds)
            .toArray();

        const allBeatIds = scenes.flatMap(scene => scene.beatIds);
        if (allBeatIds.length === 0) return [];

        const beats = await this.db.beats
            .where('id')
            .anyOf(allBeatIds)
            .toArray();

        const allScriptLineIds = beats.flatMap(beat => beat.scriptLineIds);
        if (allScriptLineIds.length === 0) return [];

        const scriptLines = await this.db.scriptlines
            .where('id')
            .anyOf(allScriptLineIds)
            .toArray();

        const characterIds = Array.from(
            new Set(scriptLines.map(sl => sl.characterId).filter((id): id is string => !!id))
        );
        if (characterIds.length === 0) return [];

        const characters = await this.db.characters
            .where('id')
            .anyOf(characterIds)
            .toArray();

        return characters;
    });
}
