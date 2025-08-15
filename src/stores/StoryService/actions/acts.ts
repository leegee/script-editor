// acts.ts
import type { LiveSignal, StoryService } from '../../story';
import type { Location, Scene, Beat, ScriptLine, Character, Act } from '../../../lib/types';

function orderByIds<T extends { id: string }>(items: T[], idOrder: string[]): T[] {
    const map = new Map(items.map(item => [item.id, item]));
    return idOrder.map(id => map.get(id)).filter(Boolean) as T[];
}

export function useAct(this: StoryService, actId: () => string | undefined) {
    return this.createLiveSignal(() => {
        const id = actId();
        if (!id) return undefined;
        return this.db.acts.get(id);
    });
}

export function useActs(this: StoryService) {
    return this.createLiveSignal(() => this.db.acts.toArray());
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

        // Sort scenes to match the order in act.sceneIds
        const sortedScenes = sceneIds
            .map(id => scenes.find(scene => scene?.id === id))
            .filter((scene): scene is Scene => scene !== undefined);

        return sortedScenes;
    });
}


export function useLocationsForAct(this: StoryService, actId: () => string | undefined): LiveSignal<Location[]> {
    return this.createLiveSignal(async () => {
        const act = await this.db.acts.get(actId());
        if (!act) return [];

        const scenes = await this.db.scenes
            .where('id')
            .anyOf(act.sceneIds)
            .toArray();

        const locationIds = [...new Set(scenes.map(s => s.locationId).filter(Boolean))];

        const locations = await this.db.locations
            .where('id')
            .anyOf(locationIds)
            .toArray();

        return orderByIds(locations, locationIds);
    });
}

export function useAllCharactersInActById(this: StoryService, actId: () => string | undefined): LiveSignal<Character[]> {
    return this.createLiveSignal(async () => {
        const id = actId();
        if (!id) return [];

        const act = await this.db.acts.get(id);
        if (!act) return [];

        const scenes = await this.db.scenes
            .where('id')
            .anyOf(act.sceneIds)
            .toArray();
        const orderedScenes = orderByIds(scenes, act.sceneIds);

        const allBeatIds = orderedScenes.flatMap(scene => scene.beatIds);
        if (allBeatIds.length === 0) return [];

        const beats = await this.db.beats
            .where('id')
            .anyOf(allBeatIds)
            .toArray();
        const orderedBeats = orderByIds(beats, allBeatIds);

        const allScriptLineIds = orderedBeats.flatMap(beat => beat.scriptLineIds);
        if (allScriptLineIds.length === 0) return [];

        const scriptLines = await this.db.scriptlines
            .where('id')
            .anyOf(allScriptLineIds)
            .toArray();
        const orderedScriptLines = orderByIds(scriptLines, allScriptLineIds);

        const characterIds = Array.from(
            new Set(orderedScriptLines.map(sl => sl.characterId).filter((id): id is string => !!id))
        );
        if (characterIds.length === 0) return [];

        const characters = await this.db.characters
            .where('id')
            .anyOf(characterIds)
            .toArray();

        return orderByIds(characters, characterIds);
    });
}
