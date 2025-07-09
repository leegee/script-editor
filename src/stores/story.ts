// Store containing the whole story

import { db, type StoryDexie } from '../stores/db';
import type { EntityMap } from '../lib/types';
import { normalizeStoryData } from '../lib/transform-tree2normalised';
import Dexie from 'dexie';
import * as ActMethods from './StoryService/actions/acts';
import * as SceneMethods from './StoryService/actions/scenes';
import * as BeatMethods from './StoryService/actions/beats';
import * as ScriptlineMethods from './StoryService/actions/scriptlines';
import * as CharacterMethods from './StoryService/actions/characters';
import * as LocationMethods from './StoryService/actions/locations';
import { denormalizeStoryTree } from '../lib/transform-noralised2tree';

type ActMethods = typeof ActMethods;
type SceneMethods = typeof SceneMethods;
type BeatMethods = typeof BeatMethods;
type ScriptlineMethods = typeof ScriptlineMethods
type CharacterMethods = typeof CharacterMethods;
type LocationMethods = typeof LocationMethods;

export interface StoryService
    extends ActMethods, SceneMethods, BeatMethods, ScriptlineMethods, CharacterMethods, LocationMethods {
    db: StoryDexie;
}

type ParentOptions<T extends keyof EntityMap> = {
    parentType: T;
    parentId: string;
    parentListField: Extract<keyof EntityMap[T], string>;
};

// To document who owns whom, and where:
export const ParentMap = {
    acts: { parentType: 'story', parentListField: 'actIds' },
    scenes: { parentType: 'acts', parentListField: 'sceneIds' },
    beats: { parentType: 'scenes', parentListField: 'beatIds' },
    scriptlines: { parentType: 'beats', parentListField: 'scriptLineIds' },
    characters: { parentType: 'story', parentListField: 'characterIds' },
    locations: { parentType: 'story', parentListField: 'locationIds' },
    story: undefined // root has no parent
} as const;


export class StoryService {
    db = db;

    constructor() {
        Object.assign(StoryService.prototype, ActMethods);
        Object.assign(StoryService.prototype, CharacterMethods);
        Object.assign(StoryService.prototype, LocationMethods);
        Object.assign(StoryService.prototype, SceneMethods);
        Object.assign(StoryService.prototype, BeatMethods);
        Object.assign(StoryService.prototype, ScriptlineMethods);

        // Bind all methods to "this" instance
        for (const key of Object.keys(ActMethods)) {
            // @ts-ignore
            this[key] = this[key].bind(this);
        }
        for (const key of Object.keys(CharacterMethods)) {
            // @ts-ignore
            this[key] = this[key].bind(this);
        }
        for (const key of Object.keys(LocationMethods)) {
            // @ts-ignore
            this[key] = this[key].bind(this);
        }
        for (const key of Object.keys(SceneMethods)) {
            // @ts-ignore
            this[key] = this[key].bind(this);
        }
        for (const key of Object.keys(BeatMethods)) {
            // @ts-ignore
            this[key] = this[key].bind(this);
        }
        for (const key of Object.keys(ScriptlineMethods)) {
            // @ts-ignore
            this[key] = this[key].bind(this);
        }
    }

    async loadStoryFromJson(rawJata): Promise<void> {
        console.log('Raw tree data:', rawJata);

        const normalized = normalizeStoryData(rawJata);
        console.log('Normalized data:', normalized);

        // Transaction to clear all tables and bulk insert
        await this.db.transaction('rw', this.db.tables, async () => {
            // Clear
            for (const table of this.db.tables) {
                await table.clear();
            }

            // Bulk insert: convert each map to array
            await Promise.all([
                await db.story.bulkPut(Object.values(normalized.stories)),
                await db.acts.bulkPut(Object.values(normalized.acts)),
                await db.scenes.bulkPut(Object.values(normalized.scenes)),
                await db.beats.bulkPut(Object.values(normalized.beats)),
                await db.scriptlines.bulkPut(Object.values(normalized.scriptlines)),
                await db.characters.bulkPut(Object.values(normalized.characters)),
                await db.locations.bulkPut(Object.values(normalized.locations)),
            ]);
        });

        console.log('Story loaded into Dexie successfully!');
    }

    private async updateParentList<T extends keyof EntityMap>(
        type: T,
        childId: string,
        parentId: string,
        mode: 'add' | 'remove'
    ): Promise<void> {
        const parentMeta = ParentMap[type as string];
        if (!parentMeta) return;

        const { parentType, parentListField } = parentMeta;

        const parentTable = this.getTable(parentType as keyof EntityMap);
        const parent = await parentTable.get(parentId);

        if (!parent) {
            console.warn(`Parent ${parentType} with id ${parentId} not found.`);
            return;
        }

        const list = (parent[parentListField] as string[]) || [];

        const newList =
            mode === 'add'
                ? list.includes(childId) ? list : [...list, childId]
                : list.filter(id => id !== childId);

        const updatedParent = {
            ...parent,
            [parentListField]: newList
        };

        await parentTable.put(updatedParent);
    }

    private getTable<T extends keyof EntityMap>(type: T): Dexie.Table<EntityMap[T], string> {
        return this.db[type] as Dexie.Table<EntityMap[T], string>;
    }

    async createEntity<T extends keyof EntityMap>(
        type: T,
        entity: EntityMap[T],
        parentId?: string
    ): Promise<EntityMap[T]> {
        await this.getTable(type).add(entity);

        if (parentId) {
            await this.updateParentList(type, entity.id, parentId, 'add');
        }

        return entity;
    }

    async getEntity<T extends keyof EntityMap>(
        type: T,
        id: string
    ): Promise<EntityMap[T] | undefined> {
        return await this.getTable(type).get(id);
    }

    async setEntity<T extends keyof EntityMap>(type: T, entity: EntityMap[T]): Promise<void> {
        await this.getTable(type).put(entity);
    }

    async updateEntity<T extends keyof EntityMap>(
        type: T,
        entity: EntityMap[T]
    ): Promise<void> {
        await this.getTable(type).put(entity);
    }

    async updateEntityField<T extends keyof EntityMap, K extends keyof EntityMap[T]>(
        type: T,
        id: string,
        key: K,
        value: EntityMap[T][K]
    ): Promise<void> {
        const table = this.getTable(type);
        const entity = await table.get(id);
        if (!entity) throw new Error(`Entity ${id} not found in ${type}`);

        const updatedEntity = { ...entity, [key]: value };
        console.log('updateEntityField', entity, key, value)
        await table.put(updatedEntity);
    }

    async deleteEntity<T extends keyof EntityMap>(type: T, id: string): Promise<void> {
        await this.getTable(type).delete(id);
    }

    // Export the entire story tree as a JSON object URL
    async asObjectUrl(): Promise<string | undefined> {
        try {
            const stories = await this.db.story.toArray();
            const acts = await this.db.acts.toArray();
            const scenes = await this.db.scenes.toArray();
            const beats = await this.db.beats.toArray();
            const scriptlines = await this.db.scriptlines.toArray();
            const characters = await this.db.characters.toArray();
            const locations = await this.db.locations.toArray();

            // Assume single story for now:
            const story = stories[0];

            // 3. Use your denormalizer to build the tree
            const tree = denormalizeStoryTree({
                story,
                acts,
                scenes,
                beats,
                scriptlines,
                characters,
                locations,
            });

            // Serialize the tree to a JSON, and finally a Blob URL.
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

Object.assign(StoryService.prototype, ActMethods);
Object.assign(StoryService.prototype, CharacterMethods);
Object.assign(StoryService.prototype, LocationMethods);
Object.assign(StoryService.prototype, SceneMethods);

export const storyApi = new StoryService();
