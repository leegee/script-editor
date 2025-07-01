// Store containing the whole story - will be persisted to localstorage and server, but not yet

import { createStore } from 'solid-js/store';

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

import { normalizeStoryData } from '../lib/transforme-tree2normalised';
import { transformStory } from '../lib/transforme-json2ts';
import rawStoryData from '../../story.json' assert { type: 'json' };

type ParentOptions = {
    parentType: keyof NormalizedStoryData;
    parentId: string;
    parentListField: string;
};

const storyData = transformStory(rawStoryData);

const normalized: NormalizedStoryData = normalizeStoryData(storyData);

const [story, setStory] = createStore<NormalizedStoryData>(normalized);

class StoryService {
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


export { story, setStory };
export const storyApi = new StoryService();
