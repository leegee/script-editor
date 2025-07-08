// src/types/story.ts

// --------------------------------------------
// 🔑 Utility: Get keys of array fields
// --------------------------------------------
// export type ArrayKeys<T> = {
//     [K in keyof T]: T[K] extends string[] | undefined ? K : never;
// }[keyof T];

type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : never
}[keyof T];

// --------------------------------------------
// 📸 Enums
// --------------------------------------------
export enum MediaType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
}

export enum ScriptLineType {
    Dialogue = 'Dialogue',
    Action = 'Action',
    Description = 'Description',
    Parenthetical = 'Parenthetical',
    Shot = 'Shot',
    Transition = 'Transition',
}

// --------------------------------------------
// 🎞️ Media Link
// --------------------------------------------
export interface MediaLink {
    id: string;
    type: MediaType;
    url: string;
    description?: string;
}

// --------------------------------------------
// 🧑 Characters & Locations
// --------------------------------------------
export interface Character {
    id: string;
    name: string;
    bio?: string;
    tags?: string[];
    avatarColor?: string;
    avatarImage?: string;
    mediaLinkIds?: string[];
}

export interface Location {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string;
    mediaLinkIds?: string[];
    tags?: string[];

    geofence?: {
        type: 'circle' | 'polygon';
        center?: [number, number]; // lat/lng
        radiusMeters?: number;
        polygonCoords?: [number, number][];
    };
}

// --------------------------------------------
// 🎬 Script Line & Beats
// --------------------------------------------
export interface ScriptLine {
    id: string;
    type: ScriptLineType;
    characterId?: string;
    text: string;
    timestampSeconds?: number;
}

export interface Beat {
    id: string;
    number: number;
    title?: string;
    summary?: string;
    durationSeconds?: number;
    scriptlines: ScriptLine[];
}

export interface Scene {
    id: string;
    number: number;
    title: string;
    summary?: string;
    locationId: string;
    durationSeconds?: number;
    beats: Beat[];
}

export interface Act {
    id: string;
    number: number;
    title: string;
    summary?: string;
    scenes: Scene[];
}

export interface Story {
    id: string;
    title: string;
    description?: string;
    acts: Act[];
    characters: Character[];
    locations: Location[];
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Scene2Character {
    id?: number;
    sceneId: string;
    characterId: string;
}

// --------------------------------------------
// 🔄 Normalized version for DAO / Store
// --------------------------------------------

// Normalize deep arrays as ID arrays
export interface ScriptLineNormalized extends Omit<ScriptLine, 'id'> {
    id: string; // keep explicit
}

export interface BeatNormalized extends Omit<Beat, 'scriptlines'> {
    scriptLineIds: string[];
}

export interface SceneNormalized {
    id: string;
    number: number;
    title: string;
    summary: string;
    locationId?: string;
    durationSeconds?: number;
    beatIds: string[];
}

export interface ActNormalized extends Omit<Act, 'scenes'> {
    sceneIds: string[];
}

export interface StoryNormalized extends Omit<Story, 'acts' | 'characters' | 'locations'> {
    actIds: string[];
    characterIds: string[];
    locationIds: string[];
}

// --------------------------------------------
// 🗂️ Normalized store shape
// --------------------------------------------
export interface NormalizedStoryData {
    stories: Record<string, StoryNormalized>;
    acts: Record<string, ActNormalized>;
    scenes: Record<string, SceneNormalized>;
    beats: Record<string, BeatNormalized>;
    scriptlines: Record<string, ScriptLineNormalized>;
    characters: Record<string, Character>;
    locations: Record<string, Location>;
}

// --------------------------------------------
// 🧩 Helpers for generic keys
// --------------------------------------------
export type EntityMap = {
    [K in keyof NormalizedStoryData]: NormalizedStoryData[K] extends Record<string, infer Item> ? Item : never;
};

export type EntityType = keyof NormalizedStoryData;

export type NumberedEntity = { number: number };

export type EntitiesWithNumber = {
    [K in keyof NormalizedStoryData]: EntityMap[K] extends NumberedEntity ? K : never;
}[keyof NormalizedStoryData];
