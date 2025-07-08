// Store containing the whole story

import { createStore, type SetStoreFunction } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';
import localforage from 'localforage';

import type {
    NormalizedStoryData,
    StoryNormalized,
    ActNormalized,
    SceneNormalized,
    BeatNormalized,
    ScriptLineNormalized,
    Character,
    Location,
    EntitiesWithNumber,
    ScriptLineType,
    EntityType,
    EntityMap,
} from '../lib/types';

import { normalizeStoryData as normalizeStoryTree } from '../lib/transform-tree2normalised';
import { transformStory as storyJsonToTypescript } from '../lib/transform-json2ts';
import rawStoryData from '../../story.json' assert { type: 'json' };
import { denormalizeStoryTree } from '../lib/transform-noralised2tree';

type ParentOptions = {
    parentType: keyof NormalizedStoryData;
    parentId: string;
    parentListField: string;
};

function createEmptyNormalized(): NormalizedStoryData {
    return {
        stories: {},
        acts: {},
        scenes: {},
        beats: {},
        scriptlines: {},
        characters: {},
        locations: {},
    };
}

export async function initializeDefaultStory() {
    // small delay so persistence store is ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    const isEmpty = Object.keys(this.story.stories).length === 0;
    if (isEmpty) {
        storyApi.loadStoryFromJson(rawStoryData);
    }
}

class StoryService {
    story: NormalizedStoryData;
    setStory: SetStoreFunction<NormalizedStoryData>;

    constructor() {
        const [story, setStory] = makePersisted(
            createStore<NormalizedStoryData>(createEmptyNormalized()),
            {
                name: 'story',
                storage: localforage,
            }
        );

        this.story = story;
        this.setStory = setStory;
    }


    resetStory() {
        this.setStory(() => createEmptyNormalized());
        console.info('Story has been reset.');
    }

    loadStoryFromJson(rawData: any) {
        const storyData = storyJsonToTypescript(rawData);
        const normalized = normalizeStoryTree(storyData);
        this.setStory(normalized);
    }

    getStory(): StoryNormalized | undefined {
        return Object.values(this.story.stories)[0];
    }

    getAct(actId: string): ActNormalized | undefined {
        return this.story.acts[actId];
    }

    getActs(): ActNormalized[] {
        return Object.values(this.story.acts).sort((a, b) => a.number - b.number);
    }

    getScenesByActId(actId: string): SceneNormalized[] {
        const act = this.story.acts[actId];
        return act?.sceneIds.map(id => this.story.scenes[id]).filter(Boolean) ?? [];
    }

    getScene(sceneId: string): SceneNormalized | undefined {
        return this.story.scenes[sceneId];
    }

    getBeatsBySceneId(sceneId: string): BeatNormalized[] {
        const scene = this.story.scenes[sceneId];
        return scene?.beatIds.map(id => this.story.beats[id]).filter(Boolean) ?? [];
    }

    getScriptLinesByBeatId(beatId: string): ScriptLineNormalized[] {
        const beat = this.story.beats[beatId];
        return beat?.scriptLineIds.map(id => this.story.scriptlines[id]).filter(Boolean) ?? [];
    }

    getCharacters(): Character[] {
        return Object.values(this.story.characters);
    }

    getCharacter(characterId: string): Character | undefined {
        return this.story.characters[characterId];
    }

    getLocations(): Location[] {
        return Object.values(this.story.locations);
    }

    getLocation(locationId: string): Location | undefined {
        return this.story.locations[locationId];
    }
    getLocationForAct(actId: string): Location[] {
        const act = this.story.acts[actId];
        if (!act) return [];

        const locationsSet = new Set<Location>();

        for (const sceneId of act.sceneIds) {
            const location = this.getLocationForScene(sceneId);
            if (location) {
                locationsSet.add(location);
            }
        }

        return Array.from(locationsSet);
    }

    getLocationForScene(sceneId: string): Location | undefined {
        const scene = this.story.scenes[sceneId];
        return scene?.locationId ? this.story.locations[scene.locationId] : undefined;
    }

    getCharactersInScene(scene: SceneNormalized): Character[] {
        const uniqueCharIds = new Set<string>();
        for (const beatId of scene.beatIds) {
            const beat = this.story.beats[beatId];
            if (!beat) continue;
            for (const lineId of beat.scriptLineIds) {
                const line = this.story.scriptlines[lineId];
                if (line?.characterId) uniqueCharIds.add(line.characterId);
            }
        }
        return Array.from(uniqueCharIds)
            .map(id => this.story.characters[id])
            .filter((c): c is Character => !!c);
    }

    getCharactersInAct(act: ActNormalized): Character[] {
        const uniqueCharIds = new Set<string>();
        for (const sceneId of act.sceneIds) {
            const scene = this.story.scenes[sceneId];
            if (!scene) continue;
            this.getCharactersInScene(scene).forEach(char => uniqueCharIds.add(char.id));
        }
        return Array.from(uniqueCharIds)
            .map(id => this.story.characters[id])
            .filter((c): c is Character => !!c);
    }

    addNewScriptLineToBeat(beatId: string): string {
        return this.createEntity(
            'scriptlines',
            { text: 'New Script Line', type: 'Dialogue' as ScriptLineType },
            { parentType: 'beats', parentId: beatId, parentListField: 'scriptLineIds' }
        );
    }

    addNewBeatToScene(sceneId: string): string {
        const beatId = this.createEntity(
            'beats',
            { title: 'New Beat', scriptLineIds: [], number: this.getNextInSequence('beats') },
            { parentType: 'scenes', parentId: sceneId, parentListField: 'beatIds' }
        );
        this.addNewScriptLineToBeat(beatId);
        return beatId;
    }

    addNewSceneToAct(actId: string): string {
        const sceneId = this.createEntity(
            'scenes',
            {
                number: this.getNextInSequence('scenes'),
                title: 'New Scene',
                summary: '',
                locationId: undefined,
                durationSeconds: undefined,
                beatIds: [],
            },
            { parentType: 'acts', parentId: actId, parentListField: 'sceneIds' }
        );
        this.addNewBeatToScene(sceneId);
        return sceneId;
    }

    asObjectUrl(): string | undefined {
        try {
            const tree = denormalizeStoryTree(this.story);
            const jsonString = JSON.stringify(tree, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Failed to export story:', error);
            alert('Failed to export story.');
            return undefined;
        }
    }

    linkLocationToScene(sceneId: string, locationId: string) {
        const scene = this.story.scenes[sceneId];
        if (!scene) return console.warn(`Scene ${sceneId} not found`);
        if (!this.story.locations[locationId]) return console.warn(`Location ${locationId} not found`);

        if (scene.locationId === locationId) return;
        this.setStory('scenes', sceneId, 'locationId', locationId);
    }

    unlinkEntityFromScene(sceneId: string, entityId: string, entityListKey: keyof SceneNormalized) {
        const scene = this.story.scenes[sceneId];
        if (!scene) return;

        const value = scene[entityListKey];
        if (Array.isArray(value)) {
            this.setStory('scenes', sceneId, entityListKey, (list = []) =>
                (list as []).filter(id => id !== entityId)
            );
        } else if (value === entityId) {
            this.setStory('scenes', sceneId, entityListKey, () => undefined);
        }
    }

    removeCharacterFromScriptLinesInScene(sceneId: string, characterId: string) {
        const scene = this.story.scenes[sceneId];
        if (!scene) return;

        const updated = { ...this.story.scriptlines };
        for (const beatId of scene.beatIds) {
            const beat = this.story.beats[beatId];
            if (!beat) continue;
            for (const lineId of beat.scriptLineIds) {
                const line = this.story.scriptlines[lineId];
                if (line?.characterId === characterId) {
                    updated[lineId] = { ...line, characterId: undefined };
                }
            }
        }
        this.setStory('scriptlines', updated);
    }

    getNextInSequence<Entity extends EntitiesWithNumber>(
        entityType: Entity,
        parentOptions?: ParentOptions
    ): number {
        let relevant: { number?: number }[] = [];
        if (parentOptions) {
            const parent = this.story[parentOptions.parentType][parentOptions.parentId];
            if (!parent) return 1;

            const childIds: string[] = (parent[parentOptions.parentListField] ?? []) as string[];
            relevant = childIds.map(id => this.story[entityType][id]).filter(Boolean);
        } else {
            relevant = Object.values(this.story[entityType]);
        }

        const numbers = relevant
            .map(e => e.number ?? 0)
            .filter(n => typeof n === 'number');
        return numbers.length ? Math.max(...numbers) + 1 : 1;
    }

    createEntity<Entity extends EntityType>(
        entityType: Entity,
        data: Partial<NormalizedStoryData[Entity][string]>,
        parentOptions?: ParentOptions
    ): string {
        const id = crypto.randomUUID();
        this.setStory(entityType, id as any, { id, ...(data as any) });

        if (parentOptions) {
            const { parentType, parentId, parentListField } = parentOptions;
            this.setStory(
                parentType,
                parentId as any,
                parentListField as any,
                (list = []) => [...list, id]
            );
        }

        return id;
    }

    getEntity<EntityType extends keyof EntityMap>(
        entityType: EntityType,
        entityId: string
    ): EntityMap[EntityType] | undefined {
        const collection = this.story[entityType] as Record<string, EntityMap[EntityType]>;
        if (!collection) return undefined;
        return collection[entityId];
    }

    updateEntity<EntityType extends keyof EntityMap, FieldType extends keyof EntityMap[EntityType]>(
        entityType: EntityType,
        entityId: string,
        field: FieldType,
        value: EntityMap[EntityType][FieldType] | undefined
    ): void {
        const collection = this.story?.[entityType] as Record<string, EntityMap[EntityType]> | undefined;
        if (!collection) {
            console.warn(`No collection found for entity type: ${entityType}`);
            return; // no such collection, exit early
        }

        const entity = collection[entityId];
        if (!entity) {
            console.warn(`No entity found with ID: ${entityId} in collection: ${entityType}`);
            return; // no such entity, exit early
        }

        if (value === undefined) {
            delete entity[field];
        } else {
            entity[field] = value;
        }
    }

    getBeatBySceneIdBeatId(sceneId: string, beatId: string): BeatNormalized | undefined {
        const scene = this.story.scenes?.[sceneId];
        if (!scene) return undefined;

        // Check if beatId belongs to the scene
        if (!scene.beatIds?.includes(beatId)) return undefined;

        // Return the beat if it exists
        return this.story.beats?.[beatId];
    }

}

export const storyApi = new StoryService();
