import type { LiveSignal, StoryService } from '../../story';
import type { Character, Location, Scene, Beat, ScriptLine } from '../../../lib/types';

function orderByIds<T extends { id: string }>(items: T[], idOrder: string[]): T[] {
    const map = new Map(items.map(item => [item.id, item]));
    return idOrder.map(id => map.get(id)).filter(Boolean) as T[];
}

export function useScene(
    this: StoryService,
    sceneId: () => string | undefined
) {
    return this.createLiveSignal(() => {
        if (!sceneId()) return undefined;
        return this.db.scenes.get(sceneId());
    });
}

export function useAllCharactersInScene(
    this: StoryService,
    sceneId: () => string | undefined
): LiveSignal<Character[]> {
    return this.createLiveSignal(async () => {
        const id = sceneId();
        if (!id) return [];

        const scene = await this.db.scenes.get(id);
        if (!scene) return [];

        const beats = await this.db.beats.where('id').anyOf(scene.beatIds ?? []).toArray();
        const orderedBeats = orderByIds(beats, scene.beatIds ?? []);

        const scriptLineIds = orderedBeats.flatMap(beat => beat.scriptLineIds ?? []);
        const scriptLines = await this.db.scriptlines.where('id').anyOf(scriptLineIds).toArray();
        const orderedScriptLines = orderByIds(scriptLines, scriptLineIds);

        const characterIds = [...new Set(orderedScriptLines.map(sl => sl.characterId).filter(Boolean))];
        const characters = await this.db.characters.where('id').anyOf(characterIds).toArray();

        return orderByIds(characters, characterIds);
    });
}

export function useScenesByActId(
    this: StoryService,
    actId: () => string | undefined
): LiveSignal<Scene[]> {
    return this.createLiveSignal(async () => {
        const acts = await this.db.acts.where('id').equals(actId()).toArray();
        const sceneIds = acts
            .map(s => s.sceneIds)
            .flat();

        const uniqueSceneIds = [...new Set(sceneIds)];
        const scenes = await this.db.scenes.bulkGet(uniqueSceneIds);

        return orderByIds(scenes.filter(Boolean) as Scene[], uniqueSceneIds);
    });
}

export async function replaceLocationInScene(
    this: StoryService,
    sceneId: string,
    locationId: string
) {
    const scene = await this.db.scenes.get(sceneId);
    if (!scene) throw new Error(`Scene with ID ${sceneId} not found`);

    const location = await this.db.locations.get(locationId);
    if (!location) throw new Error(`Location with ID ${locationId} not found`);

    await this.db.scenes.update(sceneId, { locationId });
}

export function useLocationForScene(
    this: StoryService,
    sceneId: string
): LiveSignal<Location[]> {
    return this.createLiveSignal(async () => {
        const scenes = await this.db.scenes.where('sceneId').equals(sceneId).toArray();
        const locationIds = [...new Set(scenes.map(s => s.locationId).filter(Boolean))];

        const locations = await this.db.locations.where('id').anyOf(locationIds).toArray();
        return orderByIds(locations, locationIds);
    });
}
