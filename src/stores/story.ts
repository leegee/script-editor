// Store containing the whole story

import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';
import localforage from "localforage";

import type {
    NormalizedStoryData, StoryNormalized, ActNormalized, SceneNormalized,
    BeatNormalized, ScriptLineNormalized, Character, Location, EntityMap,
    EntitiesWithNumber, ScriptLineType, ArrayKeys,
    EntityType,
} from '../lib/types';

import { normalizeStoryData as normalizeStoryTree } from '../lib/transform-tree2normalised';
import { transformStory as storyJsonToTypescript } from '../lib/transform-json2ts';

import rawStoryData from '../../story.json' assert { type: 'json' };
import { denormalizeStoryTree } from '../lib/transform-noralised2tree';
import { TreeNodeType } from '../components/Tree';

type ParentOptions = {
    parentType: keyof NormalizedStoryData;
    parentId: string;
    parentListField: string;
};

function createEmptyNormalized() {
    return {
        stories: {},
        acts: {},
        scenes: {},
        beats: {},
        scriptlines: {},
        characters: {},
        locations: {},
    } as NormalizedStoryData;
}

export async function initializeDefaultStory() {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const isEmpty = Object.keys(story.stories).length === 0;

    if (isEmpty) {
        storyApi.loadStoryFromJson(rawStoryData);
    }
}

class StoryService {
    resetStory() {
        setStory(() => (createEmptyNormalized()));
        console.info('Story has been reset.');
    }

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
            .map(lineId => story.scriptlines[lineId])
            .filter(Boolean) as ScriptLineNormalized[];
    }

    getCharacters(): Character[] {
        return Object.values(story.characters);
    }

    getLocations(): Location[] {
        return Object.values(story.locations);
    }

    getLocation(locationId: string): Location | undefined {
        return story.locations[locationId];
    }

    getLocationForScene(sceneId: string): Location | undefined {
        const scene = story.scenes[sceneId];
        if (!scene) return;
        if (!scene.locationId) return;
        return story.locations[scene.locationId];
    }

    getLocationForAct(actId: string): Location[] | undefined {
        const act = story.acts[actId];
        if (!act) return;
        const sceneIds = story.acts[actId].sceneIds;
        if (!sceneIds) return;
        return sceneIds.map(
            (sId) => story.locations[story.scenes[sId].locationId]
        );
    }

    getCharactersInScene(scene: SceneNormalized): Character[] {
        const uniqueCharIds = new Set<string>();

        for (const beatId of scene.beatIds) {
            const beat = story.beats[beatId];
            if (!beat) continue;

            for (const lineId of beat.scriptLineIds) {
                const line = story.scriptlines[lineId];
                if (line?.characterId) {
                    uniqueCharIds.add(line.characterId);
                }
            }
        }

        return Array.from(uniqueCharIds)
            .map(id => story.characters[id])
            .filter((c): c is Character => !!c);
    }

    getCharactersInAct(act: ActNormalized): Character[] {
        const uniqueCharIds = new Set<string>();

        for (const sceneId of act.sceneIds) {
            const scene = story.scenes[sceneId];
            if (!scene) continue;

            const charsInScene = this.getCharactersInScene(scene);
            for (const char of charsInScene) {
                uniqueCharIds.add(char.id);
            }
        }

        return Array.from(uniqueCharIds)
            .map(id => story.characters[id])
            .filter((c): c is Character => !!c);
    }

    getCharacter(characterId: string): Character | undefined {
        return story.characters[characterId];
    }

    addNewScriptLineToBeat(beatId: string): string {
        return this.createEntity(
            'scriptlines',
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

    linkLocationToScene(sceneId: string, locationId: string) {
        const scene = story.scenes[sceneId];
        const location = story.locations[locationId];

        if (!scene) {
            console.warn(`linkLocationToScene: Scene ${sceneId} not found`);
            return;
        }

        if (!location) {
            console.warn(`linkLocationToScene: Location ${locationId} not found`);
            return;
        }

        if (scene.locationId === locationId) {
            console.info(`Location ${locationId} already linked to scene ${sceneId}`);
            return;
        }

        setStory('scenes', sceneId, 'locationId', locationId);

        console.info(`Linked location ${locationId} to scene ${sceneId}`);
    }

    unlinkEntityFromScene(
        sceneId: string,
        entityId: string,
        entityListKey: keyof typeof story.scenes[string]
    ) {
        const scene = story.scenes[sceneId];
        if (!scene) {
            console.warn(`unlinkEntityFromScene: Scene ${sceneId} not found`);
            return;
        }

        const value = scene[entityListKey];

        if (Array.isArray(value)) {
            setStory(
                'scenes',
                sceneId,
                entityListKey,
                (currentList = []) => Array.isArray(currentList)
                    ? currentList.filter(id => id !== entityId)
                    : currentList
            );
            console.info(`Unlinked entity ${entityId} from array ${String(entityListKey)} in scene ${sceneId}`);
        }
        else if (typeof value === 'string') {
            if (value === entityId) {
                setStory('scenes', sceneId, entityListKey, () => undefined);
                console.info(`Unlinked entity ${entityId} from string ${String(entityListKey)} in scene ${sceneId}`);
            }
        }
        else {
            console.warn(
                `unlinkEntityFromScene: Scene ${sceneId} has neither array nor string for ${String(entityListKey)}`
            );
        }
    }

    removeCharacterFromScriptLinesInScene(
        sceneId: string,
        characterIdToRemove: string
    ) {
        const scene = story.scenes[sceneId];
        if (!scene) {
            console.warn(`Scene with id ${sceneId} not found`);
        }

        // Copy scriptlines record to apply changes immutably
        const updatedScriptLines = { ...story.scriptlines };

        for (const beatId of scene.beatIds) {
            const beat = story.beats[beatId];
            if (!beat) continue;

            for (const scriptLineId of beat.scriptLineIds) {
                const scriptLine = story.scriptlines[scriptLineId];
                if (!scriptLine) continue;

                if (scriptLine.characterId === characterIdToRemove) {
                    // Remove characterId by setting to undefined
                    updatedScriptLines[scriptLineId] = {
                        ...scriptLine,
                        characterId: undefined,
                    };
                }
            }
        }

        // Batch update
        setStory('scriptlines', updatedScriptLines)
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
    createEntity(
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

    getEntity(entityType: EntityType, entityId: string): EntityMap[EntityType] | undefined {
        return story[entityType][entityId] as unknown as EntityMap[EntityType];
    }

    updateEntity<
        ET extends keyof EntityMap,
        K extends keyof EntityMap[ET]
    >(
        entityType: ET,
        entityId: string,
        field: K,
        newValue: EntityMap[ET][K]
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
        const deletedEntity = story[entityType]?.[entityId];
        setStory(entityType, entityId as any, undefined);

        if (options?.parentType && options?.parentListField) {
            let parentId = options.parentId;

            if (!parentId) {
                const parent = storyApi.findParentEntity(options.parentType, options.parentListField, entityId);
                parentId = parent.id;
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

        return deletedEntity;
    }

    /**
     * Finds the parent entity and its ID given a child entity ID.
     * If parentId is provided, it just returns that parent entity directly.
     *
     * @param parentType - parent entity type , eg 'scenes'
     * @param parentListField - The field in the parent that bears children, eg 'beatIds'
     * @param childId - The ID of the child entity
     * @returns The parent entity
     */
    findParentEntity<
        ParentType extends keyof NormalizedStoryData,
        ParentListField extends ArrayKeys<NormalizedStoryData[ParentType][string]>
    >(
        parentType: ParentType,
        parentListField: ParentListField,
        childId: string
    ): NormalizedStoryData[ParentType][string] | undefined {
        const possibleParents = story[parentType];

        for (const [pid, parentEntity] of Object.entries(possibleParents)) {
            const childList = parentEntity[parentListField] as unknown as string[] | undefined;
            if (childList?.includes(childId)) {
                return parentEntity;
            }
        }
        return undefined;
    }

    moveEntity({ dropped, onto }: {
        dropped: { id: string, type: TreeNodeType },
        onto: { id: string, type: TreeNodeType, insertIndex?: number }
    }) {
        console.log('dropped', dropped, 'onto', onto);
        this.deleteEntity
    }

}

// const normalized: NormalizedStoryData = normalizeStoryTree(
//     storyJsonToTypescript(rawStoryData)
// );

export const [story, setStory] = makePersisted(
    createStore<NormalizedStoryData>(createEmptyNormalized()),
    {
        name: "story-data",
        storage: typeof window !== 'undefined' ? localforage : localStorage,
    }
);

export const storyApi = new StoryService();
