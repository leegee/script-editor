import type {
    Story,
    NormalizedStoryData,
} from './types';

export function normalizeStoryData(stories: Story | Story[]): NormalizedStoryData {
    const storyArray = Array.isArray(stories) ? stories : [stories];

    const normalized: NormalizedStoryData = {
        stories: {},
        acts: {},
        scenes: {},
        beats: {},
        scriptlines: {},
        characters: {},
        locations: {},
    };

    for (const story of storyArray) {
        // Characters and Locations go straight to normalized lookup
        for (const char of story.characters) {
            normalized.characters[char.id] = char;
        }
        for (const loc of story.locations) {
            normalized.locations[loc.id] = loc;
        }

        const actIds: string[] = [];
        for (const act of story.acts) {
            actIds.push(act.id);

            const sceneIds: string[] = [];
            for (const scene of act.scenes) {
                sceneIds.push(scene.id);

                const beatIds: string[] = [];
                for (const beat of scene.beats) {
                    beatIds.push(beat.id);

                    const scriptLineIds: string[] = [];
                    for (const sl of beat.scriptlines) {
                        scriptLineIds.push(sl.id);

                        normalized.scriptlines[sl.id] = {
                            id: sl.id,
                            type: sl.type,
                            characterId: sl.characterId,
                            text: sl.text,
                            timestampSeconds: sl.timestampSeconds,
                        };
                    }

                    normalized.beats[beat.id] = {
                        id: beat.id,
                        number: beat.number,
                        title: beat.title,
                        summary: beat.summary,
                        durationSeconds: beat.durationSeconds,
                        scriptLineIds,
                    };
                }

                normalized.scenes[scene.id] = {
                    id: scene.id,
                    number: scene.number,
                    title: scene.title,
                    summary: scene.summary,
                    locationId: scene.locationId,
                    durationSeconds: scene.durationSeconds,
                    beatIds,
                };
            }

            normalized.acts[act.id] = {
                id: act.id,
                number: act.number,
                title: act.title,
                summary: act.summary,
                sceneIds,
            };
        }

        normalized.stories[story.id] = {
            id: story.id,
            title: story.title,
            description: story.description,
            actIds,
            characterIds: story.characters.map(c => c.id),
            locationIds: story.locations.map(l => l.id),
            tags: story.tags,
            createdAt: story.createdAt,
            updatedAt: story.updatedAt,
        };
    }

    return normalized;
}
