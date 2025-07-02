// Store containing the whole story

import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';
import localforage from "localforage";

import type {
    NormalizedStoryData, StoryNormalized, ActNormalized, SceneNormalized,
    BeatNormalized, ScriptLineNormalized, Character, Location, EntityMap,
    EntitiesWithNumber, ScriptLineType, ArrayKeys,
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

const emptyNormalized: NormalizedStoryData = {
    stories: {},
    acts: {},
    scenes: {},
    beats: {},
    scriptLines: {},
    characters: {},
    locations: {},
};

class StoryService {
    loadStoryFromJson(rawData: any) {
        const storyData = storyJsonToTypescript(rawData);
        const normalized: NormalizedStoryData = normalizeStoryTree(storyData);
        setStory(normalized);
    }

    getStory(): StoryNormalized | undefined {
        return Object.values(story.stories)[0];
    }

    getActs(): ActNormalized[] {
        return Object.values(story.acts).sort((a, b) => a.number - b.number);
    }

    getAct(actId: string): ActNormalized | undefined {
        return story.acts[actId];
    }

    getScenesByActId(actId: string): SceneNormalized[] {
        const act = story.acts[actId];
        if (!act) return [];
        return act.sceneIds.map(sceneId => story.scenes[sceneId]).filter(Boolean) as SceneNormalized[];
    }

    getScene(sceneId: string): SceneNormalized | undefined {
        return story.scenes[sceneId];
    }

    getBeatsBySceneId(sceneId: string): BeatNormalized[] {
        const scene = story.scenes[sceneId];
        if (!scene) return [];
        return scene.beatIds.map(beatId => story.beats[beatId]).filter(Boolean) as BeatNormalized[];
    }

    getBeatBySceneIdBeatId(sceneId: string, beatId: string): BeatNormalized | undefined {
        const beats = this.getBeatsBySceneId(sceneId);
        return beats.find(b => b.id === beatId);
    }

    getScriptLinesByBeatId(beatId: string): ScriptLineNormalized[] {
        const beat = story.beats[beatId];
        if (!beat) return [];
        return beat.scriptLineIds
            .map(lineId => story.scriptLines[lineId])
            .filter(Boolean) as ScriptLineNormalized[];
    }

    getCharacters(): Character[] {
        return Object.values(story.characters);
    }

    getLocations(): Location[] {
        return Object.values(story.locations);
    }

    getCharacter(characterId: string): Character | undefined {
        return story.characters[characterId];
    }

    getLocation(locationId: string): Location | undefined {
        return story.locations[locationId];
    }

    addNewScriptLineToBeat(beatId: string): string {
        return this.createEntity(
            'scriptLines',
            {
                text: 'New Script Line',
                type: 'Dialogue' as ScriptLineType,
            },
            {
                parentType: 'beats',
                parentId: beatId,
                parentListField: 'scriptLineIds'
            }
        );
    }

    addNewBeatToScene(sceneId): string {
        const beatId = this.createEntity(
            'beats',
            {
                title: 'New Beat',
                scriptLineIds: [],
                number: this.getNextInSequence('beats'),
            },
            {
                parentType: 'scenes',
                parentId: sceneId,
                parentListField: 'beatIds'
            }
        );

        this.addNewScriptLineToBeat(beatId);
        return beatId;
    }

    addNewSceneToAct(actId: string): string {
        const sceneId = this.createEntity('scenes', {
            number: this.getNextInSequence('scenes'),
            title: 'New Scene',
            summary: '',
            characterIds: [],
            locationId: undefined,
            durationSeconds: undefined,
            beatIds: [],
        }, {
            parentType: 'acts',
            parentId: actId,
            parentListField: 'sceneIds',
        });

        this.addNewBeatToScene(sceneId);

        return sceneId;
    }

    asObjectUrl() {
        try {
            const tree = denormalizeStoryTree(story);
            const jsonString = JSON.stringify(tree, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            return url;
        } catch (error) {
            console.error('Failed to save story:', error);
            alert('Failed to save story.');
        }
    }

    /**
     * 
     * @param entityType 
     * @param parentOptions `ParentOptions`
     * @returns the next `number` for the supplied entity, optionally constrained by `parentOptions`.
     */
    getNextInSequence<EntityType extends EntitiesWithNumber>(
        entityType: EntityType,
        parentOptions?: ParentOptions
    ): number {
        let relevantEntities: Array<{ number?: number }> = [];

        if (parentOptions) {
            const { parentType, parentId, parentListField } = parentOptions;

            const parentEntity = story[parentType][parentId];
            // no parent, start at 1
            if (!parentEntity) return 1;

            // Get child IDs list
            const childIds: string[] = parentEntity[parentListField] ?? [];

            // Expand to actual entities:
            relevantEntities = childIds
                .map(id => story[entityType][id])
                .filter(Boolean);
        }
        else {
            // No parent
            relevantEntities = Object.values(story[entityType]) as Array<{ number?: number }>;
        }

        // For the first:
        if (relevantEntities.length === 0) return 1;

        const maxNumber = relevantEntities.reduce((max, entity) => {
            if (typeof entity.number === 'number') {
                return Math.max(max, entity.number);
            }
            return max;
        }, 0);

        return maxNumber + 1;
    }


    /**
     * 
     * @param entityType 
     * @param data 
     * @param options 
     * @returns 
     */
    createEntity<
        EntityType extends keyof NormalizedStoryData
    >(
        entityType: EntityType,
        data: Partial<NormalizedStoryData[EntityType][string]> & { id?: string },
        options?: ParentOptions
    ): string {
        const newId = data.id ?? crypto.randomUUID();

        setStory(entityType, newId as any, prev => ({
            ...prev,
            ...data,
            id: newId,
        }));

        if (options) {
            setStory(
                options.parentType,
                options.parentId as any,
                options.parentListField as any,
                (list = []) => [...list, newId]
            );
        }

        console.info('CREATED', entityType, newId);

        return newId;
    }

    getEntity<EntityType extends keyof EntityMap>(
        entityType: EntityType,
        entityId: string
    ): EntityMap[EntityType] | undefined {
        return story[entityType][entityId] as unknown as EntityMap[EntityType];
    }

    updateEntity<
        EntityType extends keyof EntityMap,
        K extends keyof EntityMap[EntityType]
    >(
        entityType: EntityType,
        entityId: string,
        field: K,
        newValue: EntityMap[EntityType][K]
    ) {
        setStory(entityType, entityId as any, prev => ({
            ...prev,
            [field]: newValue,
        }));
    }

    /**
     * 
     * @param entityType 
     * @param entityId 
     * @param options `ParentOptions` - if `parentId` is absent, it will be found
     */
    deleteEntity<
        EntityType extends keyof NormalizedStoryData,
        ParentType extends keyof NormalizedStoryData,
        ParentListField extends ArrayKeys<NormalizedStoryData[ParentType][string]>
    >(
        entityType: EntityType,
        entityId: string,
        options?: {
            parentType?: ParentType;
            parentListField?: ParentListField;
            parentId?: string;
        }
    ) {
        setStory(entityType, entityId as any, undefined); // delete entity

        if (options?.parentType && options?.parentListField) {
            let parentId = options.parentId;

            if (!parentId) {
                const possibleParents = story[options.parentType];
                for (const [pid, parentEntity] of Object.entries(possibleParents)) {
                    // TypeScript now knows parentListField is a key with value string[] | undefined
                    const childList = parentEntity[options.parentListField] as string[] | undefined;
                    if (childList?.includes(entityId)) {
                        parentId = pid;
                        break;
                    }
                }
            }

            if (parentId) {
                setStory(
                    options.parentType,
                    parentId as any,
                    options.parentListField as any,
                    (list = []) => list.filter(id => id !== entityId)
                );
            } else {
                console.warn(
                    `deleteEntity: Could not find parentId for entityId=${entityId} in parentType=${options.parentType}.${String(options.parentListField)}`
                );
                console.debug(JSON.stringify(story, null, 2));
            }
        }
    }
}

const normalized: NormalizedStoryData = normalizeStoryTree(
    storyJsonToTypescript(rawStoryData)
);

export const [story, setStory] = makePersisted(
    createStore<NormalizedStoryData>(emptyNormalized),
    {
        name: "story-data",
        storage: typeof window !== 'undefined' ? localforage : localStorage,
    }
);

export const storyApi = new StoryService();

async function initializeStory() {
    // wait for localforage to hydrate (adjust delay if needed)
    await new Promise((resolve) => setTimeout(resolve, 100));

    const isEmpty = Object.keys(story.stories).length === 0;

    if (isEmpty) {
        storyApi.loadStoryFromJson(rawStoryData);
    }
}

initializeStory();