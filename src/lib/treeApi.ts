import { createStore } from 'solid-js/store';

import type { Story, Act, Scene, Beat, ScriptLine, Character, Location } from './types';
import { traverseStoryTree } from './traverse';
import { normalizeStoryData } from './transform-tree2normalised';
import { storyJsonToTypescript } from './transform-json2ts';
import rawStoryData from '../../story.json' assert { type: 'json' };

const storyData: Story = storyJsonToTypescript(rawStoryData);
const normalized = normalizeStoryData(storyData);

const [story, setStory] = createStore<Story>(storyData as Story);

class StoryService {

    async getStory(): Promise<Story> {
        return Promise.resolve(story);
    }

    async getActs(): Promise<Act[]> {
        return Promise.resolve(story.acts);
    }

    async getActById(actId: string): Promise<Act | undefined> {
        return Promise.resolve(story.acts.find(a => a.id === actId));
    }

    async getScenesByActId(actId: string): Promise<Scene[]> {
        const act = story.acts.find(a => a.id === actId);
        return Promise.resolve(act?.scenes ?? []);
    }

    async getSceneById(sceneId: string): Promise<Scene | undefined> {
        for (const act of story.acts) {
            const scene = act.scenes.find(s => s.id === sceneId);
            if (scene) return Promise.resolve(scene);
        }
        return Promise.resolve(undefined);
    }

    async getBeatsBySceneId(sceneId: string): Promise<Beat[]> {
        for (const act of story.acts) {
            const scene = act.scenes.find(s => s.id === sceneId);
            if (scene) {
                return Promise.resolve(scene.beats ?? []);
            }
        }
        return Promise.resolve([]);
    }

    async getBeatBySceneIdBeatId(sceneId: string, beatId: string): Promise<Beat | undefined> {
        const scene = await this.getSceneById(sceneId);
        return scene?.beats.find(b => b.id === beatId);
    }

    async getCharacters(node?: Story | Act | Scene | Beat | ScriptLine | undefined): Promise<Character[]> {
        return Promise.resolve(this.getCharactersFrom(node ?? story));
    }

    async getLocations(node: Story | Act | Scene | Beat | ScriptLine | undefined): Promise<Location[]> {
        return Promise.resolve(this.getLocationsFrom(node ?? story));
    }

    async getScriptLines(node: Story | Act | Scene | Beat | ScriptLine | undefined): Promise<ScriptLine[]> {
        return Promise.resolve(this.getScriptLinesFrom(node ?? story));
    }

    async getCharacter(characterId: string): Promise<Character | undefined> {
        return Promise.resolve(story.characters.find(c => c.id === characterId));
    }

    async getLocation(locationId: string): Promise<Location | undefined> {
        return Promise.resolve(story.locations.find(loc => loc.id === locationId));
    }

    private getScriptLinesFrom(node: Story | Act | Scene | Beat | ScriptLine): ScriptLine[] {
        const lines: ScriptLine[] = [];
        traverseStoryTree(node, (n) => {
            if ('text' in n) lines.push(n as ScriptLine);
        });
        return lines;
    }

    private getCharactersFrom(node: Story | Act | Scene | Beat | ScriptLine): Character[] {
        const charIds = new Set<string>();
        traverseStoryTree(node, (n) => {
            if ('characterIds' in n) {
                n.characters?.forEach(id => charIds.add(id));
            } else if ('characterId' in n && typeof n.characterId === 'string') {
                charIds.add(n.characterId);
            }
        });
        return Array.from(charIds)
            .map(id => story.characters.find(c => c.id === id))
            .filter((c): c is Character => c !== undefined);
    }

    private getLocationsFrom(node: Story | Act | Scene | Beat | ScriptLine): Location[] {
        const locationIds = new Set<string>();
        traverseStoryTree(node, (n) => {
            if ('locationId' in n && typeof n.locationId === 'string') {
                locationIds.add(n.locationId);
            }
        });
        return Array.from(locationIds)
            .map(id => story.locations.find(l => l.id === id))
            .filter((l): l is Location => l !== undefined);
    }

    updateActTitle(actId: string, newTitle: string) {
        const index = story.acts.findIndex(a => a.id === actId);
        if (index >= 0) {
            setStory('acts', index, 'title', newTitle);
        }
    }
}

export { story, setStory };
export const fakeApi = new StoryService();
