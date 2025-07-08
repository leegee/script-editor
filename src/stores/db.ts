import Dexie, { Table } from 'dexie';
import type { NormalizedStoryData } from '../lib/types';

export class StoryDexie extends Dexie {
    story!: Table<NormalizedStoryData, string>;

    constructor() {
        super('StoryDB');
        this.version(1).stores({
            story: '', // Store only one story object; key is a dummy key
        });
    }
}

export const db = new StoryDexie();
