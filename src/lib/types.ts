// tree for IO

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




// normalized types for DAO

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
    avatarInitial?: string;
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

// Normalized entities below

export interface ScriptLineNormalized {
    id: string;
    type: ScriptLineType;
    characterId?: string;
    text: string;
    timestampSeconds?: number;
}

export interface BeatNormalized {
    id: string;
    title?: string;
    summary?: string;
    durationSeconds?: number;
    scriptLineIds: string[];
}

export interface SceneNormalized {
    id: string;
    title: string;
    summary?: string;
    characterIds: string[];
    locationId: string;
    durationSeconds?: number;
    scriptExcerpt?: string;
    beatIds: string[];
}

export interface ActNormalized {
    id: string;
    number: number;
    title: string;
    summary?: string;
    sceneIds: string[];
}

export interface StoryNormalized {
    id: string;
    title: string;
    description?: string;
    actIds: string[];
    characterIds: string[];
    locationIds: string[];
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// The normalized data store itself, for reference

export interface NormalizedStoryData {
    stories: Record<string, StoryNormalized>;
    acts: Record<string, ActNormalized>;
    scenes: Record<string, SceneNormalized>;
    beats: Record<string, BeatNormalized>;
    scriptLines: Record<string, ScriptLineNormalized>;
    characters: Record<string, Character>;
    locations: Record<string, Location>;
}
