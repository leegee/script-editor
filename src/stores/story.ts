// Store containing the whole story

import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
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
    ScriptLineType,
    EntityMap,
    ArrayKeys
} from '../lib/types';

import { normalizeStoryData as normalizeStoryTree } from '../lib/transform-tree2normalised';
import { transformStory as storyJsonToTypescript } from '../lib/transform-json2ts';
import rawStoryData from '../../story.json' assert { type: 'json' };
import { denormalizeStoryTree } from '../lib/transform-noralised2tree';

export interface ParentOptions<T extends keyof NormalizedStoryData> {
    parentType: T;
    parentId: string;
    parentListField: ArrayKeys<NormalizedStoryData[T][string]>;
}

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

export async function initializeDefaultStory(storyApi: StoryService) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const isEmpty = Object.keys(storyApi.story.stories).length === 0;
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

    setScene(sceneId: string, scene: SceneNormalized) {
        this.setStory('scenes', sceneId, scene);
    }

    getBeatsBySceneId(sceneId: string): BeatNormalized[] {
        const scene = this.story.scenes[sceneId];
        return scene?.beatIds.map(id => this.story.beats[id]).filter(Boolean) ?? [];
    }

    getBeatBySceneIdBeatId(sceneId: string, beatId: string) {
        const scene = this.db.story.scenes[sceneId];
        return scene?.beatIds.map(id => this.story.beats[id]).filter(Boolean) ?? [];
    }

    setBeat(beatId: string, beat: BeatNormalized) {
        this.setStory('beats', beatId, beat);
    }

    setScriptLine(scriptLineId: string, scriptLine: ScriptLineNormalized) {
        this.setStory('scriptlines', scriptLineId, scriptLine);
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

    getCharactersInActById(actId: string) {
        const act = this.story.acts[actId];
        if (!act) return [];
        return this.getCharactersInAct(act);
    }

    getCharactersInSceneById(sceneId: string) {
        const scene = this.story.scenes[sceneId];
        if (!scene) return [];
        return this.getCharactersInScene(scene.id);
    }

    getCharactersNotInScene(sceneId: string): Character[] {
        const inScene = new Set(this.getCharactersInScene(sceneId).map(c => c.id));
        return Object.values(this.story.characters).filter(c => !inScene.has(c.id));
    }

    linkCharacterToScene(sceneId: string, characterId: string) {
        const scene = this.story.scenes[sceneId];
        if (!scene) throw new Error("Scene not found");

        const charactersInScene = this.getCharactersInScene(sceneId).map(c => c.id);
        if (charactersInScene.includes(characterId)) return;

        let beatId = scene.beatIds[0];
        let beat = this.story.beats[beatId];

        if (!beat) {
            beatId = crypto.randomUUID();
            beat = {
                id: beatId,
                number: 1,
                scriptLineIds: []
            };
            this.setBeat(beatId, beat);
            scene.beatIds.push(beatId);
        }

        const scriptLineId = crypto.randomUUID();
        const newScriptLine: ScriptLineNormalized = {
            id: scriptLineId,
            type: 'Dialogue' as ScriptLineType,
            characterId,
            text: "",
        };

        this.setScriptLine(scriptLineId, newScriptLine);
        beat.scriptLineIds.push(scriptLineId);
        this.setBeat(beatId, beat);
        this.setScene(sceneId, scene);
    }

    unlinkCharacterFromScene(sceneId: string, characterId: string) {
        const scene = this.story.scenes[sceneId];
        if (!scene) return;

        for (const beatId of scene.beatIds) {
            const beat = this.story.beats[beatId];
            if (!beat) continue;

            const newScriptLineIds = beat.scriptLineIds.filter(scriptLineId => {
                const scriptLine = this.story.scriptlines[scriptLineId];
                return scriptLine?.characterId !== characterId;
            });

            if (newScriptLineIds.length !== beat.scriptLineIds.length) {
                beat.scriptLineIds = newScriptLineIds;
                this.setBeat(beatId, beat);
            }
        }
    }

    getLocations(): [string, Location][] {
        return Object.entries(this.story.locations);
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

    replaceLocationInScene(sceneId: string, locationId: string): Location | undefined {
        const scene = this.story.scenes[sceneId];
        if (!scene) {
            console.warn(`Scene ${sceneId} not found`);
            return undefined;
        }

        this.setStory('scenes', sceneId, 'locationId', locationId);
        return this.story.locations[locationId];
    }

    getCharactersInScene(sceneId: string): Character[] {
        const scene = this.story.scenes[sceneId];
        if (!scene) return [];

        const characterIds = new Set<string>();
        for (const beatId of scene.beatIds) {
            const beat = this.story.beats[beatId];
            if (!beat) continue;

            for (const scriptLineId of beat.scriptLineIds) {
                const scriptLine = this.story.scriptlines[scriptLineId];
                if (scriptLine?.characterId) {
                    characterIds.add(scriptLine.characterId);
                }
            }
        }
        return Array.from(characterIds)
            .map(id => this.story.characters[id])
            .filter(Boolean) as Character[];
    }

    getCharactersInAct(act: ActNormalized): Character[] {
        const uniqueCharIds = new Set<string>();
        for (const sceneId of act.sceneIds) {
            const scene = this.story.scenes[sceneId];
            if (!scene) continue;
            this.getCharactersInScene(sceneId).forEach(char => uniqueCharIds.add(char.id));
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

    getNextInSequence(type: keyof EntityMap): number {
        const items = Object.values(this.story[type]);
        return items.length ? Math.max(...items.map(i => (i as any).number || 0)) + 1 : 1;
    }


    createEntity<T extends keyof NormalizedStoryData>(
        type: T,
        entity: Partial<NormalizedStoryData[T][string]>,
        options?: ParentOptions<T>
    ) {
        const id = crypto.randomUUID();
        this.setStory(type, id, { id, ...entity });

        if (options) {
            const { parentType, parentId, parentListField } = options;
            this.setStory(
                parentType,
                parentId,
                parentListField,
                (list: string[] = []) => [...list, id]
            );
        }

        return id;
    }

    deleteEntity<T extends keyof EntityMap>(
        type: T,
        id: string,
        options?: ParentOptions
    ): void {
        // Remove the entity itself
        this.setStory(type, id, undefined);

        // If there’s a parent reference, remove the ID from its list
        if (options) {
            const { parentType, parentId, parentListField } = options;

            this.setStory(parentType, parentId, parentListField, (list: string[] = []) =>
                list.filter(itemId => itemId !== id)
            );
        }
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
}

export const storyApi = new StoryService();
