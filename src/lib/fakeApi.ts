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
} from './types';

import { normalizeStoryData } from './transforme-tree2normalised';
import { transformStory } from './transforme-json2ts';
import rawStoryData from '../../story.json' assert { type: 'json' };

const storyData = transformStory(rawStoryData);

const normalized: NormalizedStoryData = normalizeStoryData(storyData);

const [story, setStory] = createStore<NormalizedStoryData>(normalized);

class StoryService {
    getStory(): StoryNormalized | undefined {
        return Object.values(story.stories)[0];
    }

    getActs(): ActNormalized[] {
        return Object.values(story.acts);
    }

    getAct(actId: string): ActNormalized | undefined {
        return story.acts[actId];
    }

    getScenesByActId(actId: string): SceneNormalized[] {
        const act = story.acts[actId];
        if (!act) return [];
        return act.sceneIds.map(sceneId => story.scenes[sceneId]).filter(Boolean) as SceneNormalized[];
    }

    getSceneById(sceneId: string): SceneNormalized | undefined {
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
}

export { story, setStory };
export const fakeApi = new StoryService();
