import type { Story, Act, Scene, Beat, ScriptLine, Character, Location } from './types';
import storyData from '../../story.json' assert { type: 'json' };
import { traverseStoryTree } from './traverse';

class StoryService {
    private story: Story;

    constructor(story: Story) {
        this.story = story;
    }

    async getStory(): Promise<Story> {
        return Promise.resolve(this.story);
    }

    async getActs(): Promise<Act[]> {
        return Promise.resolve(this.story.acts);
    }

    async getActById(actId: string): Promise<Act | undefined> {
        const act = this.story.acts.find(a => a.id === actId);
        return Promise.resolve(act);
    }

    async getScenesByActId(actId: string): Promise<Scene[]> {
        const act = this.story.acts.find(a => a.id === actId);
        return Promise.resolve(act?.scenes ?? []);
    }

    async getSceneById(sceneId: string): Promise<Scene | undefined> {
        for (const act of this.story.acts) {
            const scene = act.scenes.find(s => s.id === sceneId);
            if (scene) return Promise.resolve(scene);
        }
        return Promise.resolve(undefined);
    }

    async getCharacters(node: Story | Act | Scene | Beat | ScriptLine | undefined): Promise<Character[]> {
        return Promise.resolve(this.getCharactersFrom(
            typeof node === 'undefined' ? this.story : node
        ));
    }

    async getLocations(node: Story | Act | Scene | Beat | ScriptLine): Promise<Location[]> {
        return Promise.resolve(this.getLocationsFrom(node));
    }

    async getScriptLines(node: Story | Act | Scene | Beat | ScriptLine): Promise<ScriptLine[]> {
        return Promise.resolve(this.getScriptLinesFrom(node));
    }


    async getCharacter(characterId: string): Promise<Character | undefined> {
        return this.story.characters.find(c => c.id === characterId);
    }

    async getLocation(locationId: string): Promise<Location | undefined> {
        return this.story.locations.find(loc => loc.id === locationId);
    }

    private getScriptLinesFrom(node: Story | Act | Scene | Beat | ScriptLine): ScriptLine[] {
        const lines: ScriptLine[] = [];

        traverseStoryTree(node, (n) => {
            if ('text' in n) {
                lines.push(n as ScriptLine);
            }
        });

        return lines;
    }

    private getCharactersFrom(node: Story | Act | Scene | Beat | ScriptLine): Character[] {
        const charIds = new Set<string>();

        traverseStoryTree(node, (n) => {
            if ('characterIds' in n) {
                n.characterIds?.forEach(id => charIds.add(id));
            } else if ('characterId' in n && typeof n.characterId === 'string') {
                charIds.add(n.characterId);
            }
        });

        return Array.from(charIds)
            .map(id => this.story.characters.find(c => c.id === id))
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
            .map(id => this.story.locations.find(l => l.id === id))
            .filter((l): l is Location => l !== undefined);
    }

}

export const fakeApi = new StoryService(storyData as Story);
