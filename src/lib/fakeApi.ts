import type { Story, Scene, Character, Location, Act, ScriptLine } from './types';
import { ScriptLineType } from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fakeApi = {
    async getStory(): Promise<Story> {
        await delay(200);
        return structuredClone(sampleStory);
    },

    async getActs(): Promise<Act[]> {
        await delay(100);
        return sampleStory.acts || [];
    },

    async getAct(actId: string): Promise<Act | undefined> {
        await delay(100);
        return sampleStory.acts.find(act => act.id === actId);
    },

    async getScenes(actId: string): Promise<Scene[]> {
        await delay(100);
        return sampleStory.scenes;
    },

    async getScene(actId: string, sceneId: string): Promise<Scene> {
        await delay(100);
        return sampleStory.scenes.find(scene => scene.actId == actId && scene.id === sceneId);
    },

    async getCharacters(): Promise<Character[]> {
        await delay(10);
        return sampleStory.characters;
    },

    async getCharacter(charId: string): Promise<Character | undefined> {
        await delay(100);
        return sampleStory.characters.find(c => c.id === charId);
    },

    async getLocation(locId: string): Promise<Location | undefined> {
        await delay(100);
        return sampleStory.locations.find(l => l.id === locId);
    },

    async getActScenes(actId: string): Promise<Scene[]> {
        await delay(150);
        const act = sampleStory.acts?.find(a => a.id === actId);
        return act
            ? sampleStory.scenes.filter(scene => act.sceneIds.includes(scene.id))
            : [];
    },

    async updateScene(sceneId: string, updates: Partial<Scene>): Promise<Scene | undefined> {
        const scene = sampleStory.scenes.find(s => s.id === sceneId);
        if (!scene) return undefined;
        Object.assign(scene, updates);
        return scene;
    },

    async listActs(): Promise<Act[]> {
        await delay(100);
        return sampleStory.acts ?? [];
    }
};

// Sample Data Matching `types.ts`

const sampleStory: Story = {
    id: 'story-001',
    title: 'The Demo Tale',
    description: 'A demonstration story with acts, scenes, and characters.',
    tags: ['demo', 'fake'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    characters: [
        {
            id: 'char-1',
            name: 'Alice',
            avatarColor: '#f44336',
            bio: 'Blah blah blah',
        },
        {
            id: 'char-2',
            name: 'Ben',
            avatarColor: '#2196f3',
            bio: 'Hmm dee dah',
        }
    ],

    locations: [
        {
            id: 'loc-1',
            name: 'Ancient Forest',
            description: 'A mysterious forest filled with secrets.',
        },
        {
            id: 'loc-2',
            name: 'Crystal Cave',
            description: 'A glowing cave deep beneath the earth.',
        }
    ],

    scenes: [
        {
            id: 'scene-1',
            title: 'A Whisper in the Trees',
            summary: 'Alice hears something in the forest.',
            characters: ['char-1'],
            locationId: 'loc-1',
            scriptExcerpt: 'ALICE\n(whispering)\nDid you hear that?',
            scriptLines: [
                {
                    id: 'line-1',
                    type: ScriptLineType.Description,
                    text: 'The wind rustles softly through the trees.',
                },
                {
                    id: 'line-2',
                    type: ScriptLineType.Dialogue,
                    characterId: 'char-1',
                    text: 'Did you hear that?',
                }
            ],
            actId: 'act-1',
        },
        {
            id: 'scene-2',
            title: 'Echoes Below',
            characters: ['char-1', 'char-2'],
            locationId: 'loc-2',
            durationSeconds: 90,
            scriptLines: [
                {
                    id: 'line-3',
                    type: ScriptLineType.Description,
                    text: 'Crystals glow faintly in the cavern walls.',
                },
                {
                    id: 'line-4',
                    type: ScriptLineType.Dialogue,
                    characterId: 'char-2',
                    text: 'I don’t like this place...',
                }
            ],
            actId: 'act-2',
        }
    ],

    acts: [
        {
            id: 'act-1',
            number: 1,
            title: 'The Forest',
            sceneIds: ['scene-1'],
        },
        {
            id: 'act-2',
            number: 2,
            title: 'The Descent',
            sceneIds: ['scene-2'],
        }
    ],
};
