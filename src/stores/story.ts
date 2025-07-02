// Store containing the whole story

import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';

import type {
    NormalizedStoryData,
    StoryNormalized,
    ActNormalized,
    SceneNormalized,
    BeatNormalized,
    ScriptLineNormalized,
    Character,
    Location,
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

    updateActTitle(actId: string, newTitle: string) {
        setStory('acts', actId, 'title', newTitle);
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

    deleteEntity<
        EntityType extends keyof NormalizedStoryData
    >(
        entityType: EntityType,
        entityId: string,
        options?: ParentOptions
    ) {
        setStory(entityType, entityId as any, undefined); // delete entity

        if (options) {
            setStory(
                options.parentType,
                options.parentId as any,
                options.parentListField as any,
                (list = []) => list.filter(id => id !== entityId)
            );
        }
    }
}

const normalized: NormalizedStoryData = normalizeStoryTree(
    storyJsonToTypescript(rawStoryData)
);

export const [story, setStory] = makePersisted(
    createStore<NormalizedStoryData>(normalized),
    {
        name: "story-data",
        storage: localStorage,
    }
);

export const storyApi = new StoryService();
