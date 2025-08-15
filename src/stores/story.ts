// Store containing the whole story
import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import Dexie, { liveQuery } from 'dexie';
import { db, type StoryDexie } from '../stores/db';
import type { EntityMap, NormalizedStoryData } from '../lib/types';
import { normalizeStoryData } from '../lib/transform-tree2normalised';
import { denormalizeStoryTree } from '../lib/transform-noralised2tree';
import * as ActMixin from './StoryService/actions/acts';
import * as SceneMixin from './StoryService/actions/scenes';
import * as BeatMixin from './StoryService/actions/beats';
import * as ScriptlineMixin from './StoryService/actions/scriptlines';
import * as CharacterMixin from './StoryService/actions/characters';
import * as LocationMixin from './StoryService/actions/locations';
import * as PlotMixin from './StoryService/actions/plots';

type ActMethods = typeof ActMixin;
type BeatMethods = typeof BeatMixin;
type CharacterMethods = typeof CharacterMixin;
type LocationMethods = typeof LocationMixin;
type PlotMethods = typeof PlotMixin;
type SceneMethods = typeof SceneMixin;
type ScriptlineMethods = typeof ScriptlineMixin

export type LiveSignal<T> = readonly [Accessor<T | undefined>];

const MethodModules = [
    ActMixin,
    BeatMixin,
    CharacterMixin,
    LocationMixin,
    PlotMixin,
    SceneMixin,
    ScriptlineMixin,
];

export interface StoryService extends
    ActMethods, SceneMethods, BeatMethods,
    ScriptlineMethods, CharacterMethods, LocationMethods, PlotMethods { db: StoryDexie; }

type ParentOptions<T extends keyof EntityMap> = {
    parentType: T;
    parentId: string;
    parentListField: Extract<keyof EntityMap[T], string>;
};

// To document who owns whom, and where:
export const ParentMap = {
    acts: { parentType: 'stories', parentListField: 'actIds' },
    beats: { parentType: 'scenes', parentListField: 'beatIds' },
    scriptlines: { parentType: 'beats', parentListField: 'scriptLineIds' },
    characters: { parentType: 'stories', parentListField: 'characterIds' },
    locations: { parentType: 'stories', parentListField: 'locationIds' },
    plots: { parentType: 'stories', parentListField: 'plotIds' },
    stories: undefined, // root has no parent
    scenes: { parentType: 'acts', parentListField: 'sceneIds' },
} as const;


export class StoryService {
    db = db;

    constructor() {
        Object.assign(StoryService.prototype, ActMixin);
        Object.assign(StoryService.prototype, CharacterMixin);
        Object.assign(StoryService.prototype, LocationMixin);
        Object.assign(StoryService.prototype, SceneMixin);
        Object.assign(StoryService.prototype, BeatMixin);
        Object.assign(StoryService.prototype, ScriptlineMixin);

        // Bind all methods from the mixins to `this`instance:
        for (const methods of MethodModules) {
            for (const key of Object.keys(methods)) {
                // @ts-ignore
                this[key] = this[key].bind(this);
            }
        }
    }

    /**
     * Resets the entire story database by clearing all tables.
     * Use with caution — this removes all data!
     */
    async resetStory(): Promise<void> {
        await this.db.transaction('rw', this.db.tables, async () => {
            for (const table of this.db.tables) {
                await table.clear();
            }
        });
        console.info('All story data has been reset.');
    }


    createLiveSignal<T>(queryFn: () => Promise<T> | T) {
        const [data, setData] = createSignal<T | undefined>(undefined);

        createEffect(() => {
            const result = queryFn();

            if (result instanceof Promise) {
                let cancelled = false;
                result.then((value) => {
                    if (!cancelled) setData(() => value as T);
                });
                onCleanup(() => { cancelled = true });
            } else {
                // If queryFn returns a Dexie collection or Table, wrap it in liveQuery directly
                const observable = liveQuery(() => queryFn() as T);
                const subscription = observable.subscribe({
                    next: (value) => setData(() => value as T),
                });
                onCleanup(() => subscription.unsubscribe());
            }
        });

        return [data] as const;
    }

    async loadStoryFromJson(rawJata): Promise<void> {
        console.log('Raw tree data:', rawJata);

        const normalized = normalizeStoryData(rawJata);
        console.log('Normalized data:', normalized);

        await this.db.transaction('rw', this.db.tables, async () => {
            for (const table of this.db.tables) {
                await table.clear();
            }

            // Bulk insert: convert each map to array
            await Promise.all([
                await db.stories.bulkPut(Object.values(normalized.stories)),
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

    useFirstStoryId() {
        return this.createLiveSignal(async () => {
            const firstItem = await this.db.stories
                .toCollection()
                .first();
            return firstItem?.id ?? null;
        });
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
        console.log('story.createEntity called with id', entity.id);
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
        let rv;
        try {
            rv = await this.getTable(type).get(id);
        } catch (e) {
            console.error(e);
            throw new Error('Could not get entity type ' + type + ' id ' + id);
        }
        return rv;
    }


    async getEntities<T extends keyof EntityMap>(type: T): Promise<EntityMap[T][]> {
        const table = this.db[type] as Dexie.Table<EntityMap[T], string>;
        const allEntities = await table.toArray();
        console.log(`[StoryService] getEntities - Fetched ${allEntities.length} entities of type='${type}'`);
        return allEntities;
    }

    async setEntity<T extends keyof EntityMap>(type: T, entity: EntityMap[T]): Promise<void> {
        await this.getTable(type).put(entity);
    }

    async updateEntity<T extends keyof EntityMap>(
        type: T,
        entity: EntityMap[T]
    ): Promise<void> {
        console.log('storyApi.updateEntity: type = ' + type, 'entity =', JSON.stringify(entity))
        const table = this.getTable(type);
        console.log('Before put, current row:', JSON.stringify(await table.get(entity.id)));
        await table.put(entity);
        console.log('After put, row:', JSON.stringify(await table.get(entity.id)));
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
        console.info('updateEntityField put', entity, key)
        await table.put(updatedEntity);
    }

    async deleteEntity<T extends keyof EntityMap>(
        type: T,
        id: string,
        parentInfo?: {
            parentType: keyof EntityMap;
            parentListField: string;
            parentId: string;
        }
    ): Promise<void> {
        await this.getTable(type).delete(id);
        console.info(`Deleted from ${type} id ${id}`);
        if (parentInfo) {
            await this.updateParentList(
                type,
                id,
                parentInfo.parentId,
                'remove'
            );
        }
    }

    // Only used by ScriptLineCard - and does that even use it?
    async findParentEntity(
        entityType: keyof NormalizedStoryData,  // eg 'beats'
        arrayKey: string,                       // eg 'scriptLineIds'
        childId: string
    ): Promise<EntityMap[keyof EntityMap] | undefined> {
        const table = db[entityType] as Dexie.Table<any, string>;
        const entities = await table.toArray();

        return entities.find(entity => {
            const arr = entity[arrayKey];
            return Array.isArray(arr) && arr.includes(childId);
        });
    }

    async unlinkEntityFromParent<T extends keyof EntityMap>(
        parentType: T,
        parentId: string,
        childId: string,
        listField: keyof EntityMap[T]
    ): Promise<void> {
        const parentTable = this.getTable(parentType);
        const parent = await parentTable.get(parentId);
        if (!parent) throw new Error(`Parent ${parentType} ${parentId} not found`);

        const currentList = parent[listField];
        if (!Array.isArray(currentList)) {
            throw new Error(`${String(listField)} is not an array field on ${parentType}`);
        }

        const updatedList = currentList.filter((id: string) => id !== childId);
        const updatedParent = {
            ...parent,
            [listField]: updatedList,
        };

        await parentTable.put(updatedParent);
    }

    async asObjectUrl(): Promise<string | undefined> {
        try {
            const stories = await this.db.stories.toArray();
            const acts = await this.db.acts.toArray();
            const scenes = await this.db.scenes.toArray();
            const beats = await this.db.beats.toArray();
            const scriptlines = await this.db.scriptlines.toArray();
            const characters = await this.db.characters.toArray();
            const locations = await this.db.locations.toArray();

            const story = stories[0];

            const tree = denormalizeStoryTree({
                story,
                acts,
                scenes,
                beats,
                scriptlines,
                characters,
                locations,
            });

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

Object.assign(StoryService.prototype, ActMixin);
Object.assign(StoryService.prototype, CharacterMixin);
Object.assign(StoryService.prototype, LocationMixin);
Object.assign(StoryService.prototype, SceneMixin);
Object.assign(StoryService.prototype, PlotMixin);
Object.assign(StoryService.prototype, BeatMixin);
Object.assign(StoryService.prototype, ScriptlineMixin);

export const storyApi = new StoryService();
