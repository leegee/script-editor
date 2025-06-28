// src/lib/types.ts

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
}

export interface MediaLink {
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
    avatarInitial?: string;
    avatarImage?: string;
    media?: MediaLink[];
}

export interface Location {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string;
    media?: MediaLink[];
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
    // type: string;
    characterId?: string;
    text: string;
    timestampSeconds?: number;
}

export interface Beat {
    id: string;
    title?: string;
    summary?: string;
    durationSeconds?: number;
    scriptLines: ScriptLine[];
}

export interface Scene {
    id: string;
    title: string;
    summary?: string;
    characterIds: string[];
    locationId: string;
    durationSeconds?: number;
    scriptExcerpt?: string;
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
