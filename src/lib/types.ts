// src/lib/types.ts

// --------------------
// Enums for clarity
// --------------------

export enum MediaType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
}

export enum ScriptLineType {
    Dialogue = 'dialogue',
    Action = 'action',
    Description = 'description',
    Parenthetical = 'parenthetical',
}

// --------------------
// Core Interfaces
// --------------------

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

    // Derivable metadata
    firstAppearanceSceneId?: string;
    totalScreenTimeSeconds?: number;
    sceneIds?: string[];
    locationIds?: string[];
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
    characterId?: string; // for dialogue lines
    text: string;
    timestampSeconds?: number; // optional screenplay timing
    children?: ScriptLine[]; // nested dialogue or description blocks
}

export interface Scene {
    id: string;
    title: string;
    summary?: string;
    characters: string[]; // character IDs
    locationId: string;
    durationSeconds?: number;

    // Optional manually entered summary snippet
    scriptExcerpt?: string;

    scriptLines?: ScriptLine[];

    // Optional back-reference to act
    actId?: string;
}

export interface Act {
    id: string;
    number: number;
    title: string;
    summary?: string;
    sceneIds: string[];
}

export interface Story {
    id: string;
    title: string;
    description?: string;

    characters: Character[];
    locations: Location[];
    scenes: Scene[];

    // Optional act breakdown (Acts contain ordered scene IDs)
    acts?: Act[];

    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}
