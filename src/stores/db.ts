import Dexie, { Table } from 'dexie';
import type { Scene, Beat, ScriptLine, Story, Act, Character, Location } from '../lib/types';

export interface StoryDexieTables {
    story: Dexie.Table<Story, string>;
    acts: Dexie.Table<Act, string>;
    scenes: Dexie.Table<Scene, string>;
    beats: Dexie.Table<Beat, string>;
    scriptlines: Dexie.Table<ScriptLine, string>;
    characters: Dexie.Table<Character, string>;
    locations: Dexie.Table<Location, string>;
}


export class StoryDexie extends Dexie implements StoryDexieTables {
    story!: Table<Story, string>;
    acts!: Table<Act, string>;
    scenes!: Table<Scene, string>;
    beats!: Table<Beat, string>;
    scriptlines!: Table<ScriptLine, string>;
    characters!: Table<Character, string>;
    locations!: Table<Location, string>;

    constructor() {
        super('StoryDB');
        this.version(1).stores({
            story: '&id, *actIds, *characterIds, *locationIds',
            acts: '&id, *sceneIds',
            scenes: '&id, *beatIds',
            beats: '&id, &sceneId, *scriptLineIds',
            scriptlines: '&id, beatId',
            characters: '&id, sceneId',
            locations: '&id'
        });
    }
}

export const db: StoryDexie = new StoryDexie();
