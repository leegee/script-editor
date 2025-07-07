import {
    Story, Act, Scene, Beat, ScriptLine, ScriptLineType,
    Character, Location, MediaLink, MediaType
} from './types';

function parseScriptLineType(typeStr: string): ScriptLineType {
    switch (typeStr) {
        case 'Dialogue': return ScriptLineType.Dialogue;
        case 'Action': return ScriptLineType.Action;
        case 'Description': return ScriptLineType.Description;
        case 'Parenthetical': return ScriptLineType.Parenthetical;
        case 'Shot': return ScriptLineType.Shot;
        case 'Transition': return ScriptLineType.Transition;
        default:
            throw new Error(`Invalid ScriptLineType: ${typeStr}`);
    }
}

function transformScriptLine(raw: any): ScriptLine {
    return {
        id: raw.id,
        type: parseScriptLineType(raw.type),
        characterId: raw.characterId,
        text: raw.text,
        timestampSeconds: raw.timestampSeconds,
    };
}

function transformBeat(raw: any, index: number): Beat {
    return {
        id: raw.id,
        number: raw.number ?? (index + 1),
        title: raw.title,
        summary: raw.summary,
        durationSeconds: raw.durationSeconds,
        scriptlines: raw.scriptlines.map(transformScriptLine),
    };
}

function transformScene(raw: any, index: number): Scene {
    return {
        id: raw.id,
        number: raw.number ?? (index + 1),
        title: raw.title,
        summary: raw.summary,
        locationId: raw.locationId,
        durationSeconds: raw.durationSeconds,
        beats: raw.beats.map((b: any, i: number) => transformBeat(b, i)),
    };
}

function transformAct(raw: any, index: number): Act {
    return {
        id: raw.id,
        number: raw.number ?? (index + 1),
        title: raw.title,
        summary: raw.summary,
        scenes: raw.scenes.map((s: any, i: number) => transformScene(s, i)),
    };
}

function transformMediaLink(raw: any): MediaLink {
    return {
        id: raw.id,
        type: raw.type as MediaType,
        url: raw.url,
        description: raw.description,
    };
}

function transformCharacter(raw: any): Character {
    return {
        id: raw.id,
        name: raw.name,
        bio: raw.bio,
        tags: raw.tags,
        avatarColor: raw.avatarColor,
        avatarImage: raw.avatarImage,
        mediaLinkIds: raw.media?.map((m: any) => m.id),
    };
}

function transformLocation(raw: any): Location {
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        photoUrl: raw.photoUrl,
        tags: raw.tags,
        mediaLinkIds: raw.media?.map((m: any) => m.id),
        geofence: raw.geofence ? {
            type: raw.geofence.type,
            center: raw.geofence.center,
            radiusMeters: raw.geofence.radiusMeters,
            polygonCoords: raw.geofence.polygonCoords,
        } : undefined,
    };
}

export function transformStory(raw: any): Story {
    if (!raw.acts || !Array.isArray(raw.acts)) {
        throw new Error(`Invalid story data: acts is missing or not an array: ${JSON.stringify(raw, null, 4)}`);
    }

    return {
        id: raw.id,
        title: raw.title,
        description: raw.description,
        acts: raw.acts.map((a: any, i: number) => transformAct(a, i)),
        characters: raw.characters.map(transformCharacter),
        locations: raw.locations.map(transformLocation),
        tags: raw.tags,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
}
