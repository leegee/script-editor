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

function transformBeat(raw: any): Beat {
    return {
        id: raw.id,
        title: raw.title,
        summary: raw.summary,
        durationSeconds: raw.durationSeconds,
        scriptLines: raw.scriptLines.map(transformScriptLine),
    };
}

function transformScene(raw: any): Scene {
    return {
        id: raw.id,
        title: raw.title,
        summary: raw.summary,
        characterIds: raw.characterIds,
        locationId: raw.locationId,
        durationSeconds: raw.durationSeconds,
        beats: raw.beats.map(transformBeat),
    };
}

function transformAct(raw: any): Act {
    return {
        id: raw.id,
        number: raw.number,
        title: raw.title,
        summary: raw.summary,
        scenes: raw.scenes.map(transformScene),
    };
}

function transformMediaLink(raw: any): MediaLink {
    return {
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
        avatarInitial: raw.avatarInitial,
        avatarImage: raw.avatarImage,
        media: raw.media ? raw.media.map(transformMediaLink) : undefined,
    };
}

function transformLocation(raw: any): Location {
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        photoUrl: raw.photoUrl,
        tags: raw.tags,
        media: raw.media ? raw.media.map(transformMediaLink) : undefined,
        geofence: raw.geofence ? {
            type: raw.geofence.type,
            center: raw.geofence.center,
            radiusMeters: raw.geofence.radiusMeters,
            polygonCoords: raw.geofence.polygonCoords,
        } : undefined,
    };
}

export function transformStory(raw: any): Story {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description,
        acts: raw.acts.map(transformAct),
        characters: raw.characters.map(transformCharacter),
        locations: raw.locations.map(transformLocation),
        tags: raw.tags,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
}
