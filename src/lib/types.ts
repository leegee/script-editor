// src/types/story.ts

export type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : never
}[keyof T];


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

export interface MediaLink {
    id: string;
    type: MediaType;
    url: string;
    description?: string;
}

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


export interface ScriptLine {
    id: string;
    type: ScriptLineType;
    characterId: string | null;
    text: string;
    timestampSeconds?: number;
}

export interface Beat {
    id: string;
    number: number;
    title?: string;
    summary: string;
    durationSeconds?: number;
    scriptLineIds: string[];
}

export interface Scene {
    id: string;
    number: number;
    title: string;
    summary: string;
    locationId: string;
    durationSeconds?: number;
    beatIds: string[];
}

export interface Act {
    id: string;
    number: number;
    title: string;
    summary: string;
    sceneIds: string[];
}

export interface Story {
    id: string;
    title: string;
    description: string;
    actIds: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;

}

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
    locationId: string;
    durationSeconds?: number;
    beatIds: string[];
}

export interface ActNormalized extends Omit<Act, 'scenes'> {
    sceneIds: string[];
}

export interface StoryNormalized extends Omit<Story, 'acts' | 'characters' | 'locations'> {
    actIds: string[];
}

export interface NormalizedStoryData {
    stories: Record<string, Story>;
    acts: Record<string, Act>;
    scenes: Record<string, Scene>;
    beats: Record<string, Beat>;
    scriptlines: Record<string, ScriptLine>;
    characters: Record<string, Character>;
    locations: Record<string, Location>;
}

export type EntityMap = {
    story: Story;
    acts: Act;
    scenes: Scene;
    beats: Beat;
    scriptlines: ScriptLine;
    characters: Character;
    locations: Location;
};

export type EntityType = keyof NormalizedStoryData;

export interface StoryTree {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    characters: Character[];
    locations: Location[];
    acts: ActTree[];
}

export interface ActTree {
    id: string;
    number: number;
    title: string;
    summary: string;
    scenes: SceneTree[];
}

export interface SceneTree {
    id: string;
    number: number;
    title: string;
    summary: string;
    locationId: string;
    durationSeconds?: number;
    beats: BeatTree[];
}

export interface BeatTree {
    id: string;
    number: number;
    title: string;
    summary: string;
    durationSeconds?: number;
    scriptlines: ScriptLine[];
}
