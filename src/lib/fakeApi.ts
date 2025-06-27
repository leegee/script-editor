import type { Story, Act, Scene, Beat, ScriptLine, Character, Location } from './types';
import storyData from '../../story.json' assert { type: 'json' };

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

    async getCharacters(node: Story | Act | Scene | Beat | ScriptLine): Promise<Character[]> {
        return Promise.resolve(this.getCharactersFrom(node));
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

    private getScriptLinesFrom(node: Story | Act | Scene | Beat | ScriptLine): ScriptLine[] {
        const lines: ScriptLine[] = [];

        const recurse = (n: Story | Act | Scene | Beat | ScriptLine | undefined) => {
            if (!n) return;

            if ('acts' in n) {
                n.acts.forEach(recurse);
            } else if ('scenes' in n) {
                n.scenes.forEach(recurse);
            } else if ('beats' in n) {
                n.beats.forEach(recurse);
            } else if ('scriptLines' in n) {
                n.scriptLines.forEach(recurse);
            } else if ('text' in n) {
                lines.push(n);
                if ('children' in n && Array.isArray(n.children)) {
                    n.children.forEach(recurse);
                }
            }
        };

        recurse(node);
        return lines;
    }

    private getCharactersFrom(node: Story | Act | Scene | Beat | ScriptLine): Character[] {
        const charIds = new Set<string>();

        const recurse = (n: Story | Act | Scene | Beat | ScriptLine | undefined) => {
            if (!n) return;  // Safety check to avoid 'in' operator on undefined
            if ('acts' in n) {
                n.acts.forEach(recurse);
            } else if ('scenes' in n) {
                n.scenes.forEach(recurse);
            } else if ('beats' in n) {
                n.characterIds?.forEach(id => charIds.add(id));
                n.beats.forEach(recurse);
            } else if ('scriptLines' in n) {
                n.scriptLines.forEach(recurse);
            } else if ('characterId' in n && typeof n.characterId === 'string') {
                charIds.add(n.characterId);
                if ('children' in n && Array.isArray(n.children)) {
                    n.children.forEach(recurse);
                }
            }
        };

        recurse(node);

        return Array.from(charIds)
            .map(id => this.story.characters.find(c => c.id === id))
            .filter((c): c is Character => c !== undefined);
    }

    private getLocationsFrom(node: Story | Act | Scene | Beat | ScriptLine): Location[] {
        const locIds = new Set<string>();

        const recurse = (n: Story | Act | Scene | Beat | ScriptLine) => {
            if ('acts' in n) {
                n.acts.forEach(recurse);
            } else if ('scenes' in n) {
                n.scenes.forEach(recurse);
            } else if ('beats' in n) {
                if (n.locationId) locIds.add(n.locationId);
                n.beats.forEach(recurse);
            } else if ('scriptLines' in n) {
                n.scriptLines.forEach(recurse);
            } else {
                if ('children' in n && Array.isArray(n.children)) {
                    n.children.forEach(recurse);
                }
            }
        };

        recurse(node);

        return Array.from(locIds)
            .map(id => this.story.locations.find(l => l.id === id))
            .filter((l): l is Location => l !== undefined);
    }

}

export const fakeApi = new StoryService(storyData);
