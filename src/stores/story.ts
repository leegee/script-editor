// Store containing the whole story
import { createResource, createSignal, onCleanup } from 'solid-js';
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

type ActMethods = typeof ActMixin;
type BeatMethods = typeof BeatMixin;
type CharacterMethods = typeof CharacterMixin;
type LocationMethods = typeof LocationMixin;
type SceneMethods = typeof SceneMixin;
type ScriptlineMethods = typeof ScriptlineMixin

const MethodModules = [
    ActMixin,
    BeatMixin,
    CharacterMixin,
    LocationMixin,
    SceneMixin,
    ScriptlineMixin,
];

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

    createLiveResource<T>(queryFn: () => Promise<T> | T) {
        const [data, setData] = createSignal<T | undefined>(undefined);

        const subscription = liveQuery(queryFn).subscribe({
            next: (value) => setData(value as Exclude<T, Function>),
        });

        onCleanup(() => subscription.unsubscribe());

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

    async getNextInSequence(this: StoryService, entity: keyof NormalizedStoryData): Promise<number> {
        const table = this.db[entity];
        if (!table) throw new Error(`Unknown entity: ${entity}`);

        const highest = await table.orderBy('number').last();
        return highest ? highest.number + 1 : 1;
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
        console.info('updateEntityField put', entity, key)
        await table.put(updatedEntity);
    }

    async deleteEntity<T extends keyof EntityMap>(type: T, id: string): Promise<void> {
        await this.getTable(type).delete(id);
    }

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

    async asObjectUrl(): Promise<string | undefined> {
        try {
            const stories = await this.db.story.toArray();
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

export const storyApi = new StoryService();
