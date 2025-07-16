import type {
    Story,
    NormalizedStoryData,
    StoryTree,
} from './types';

export function normalizeStoryData(tree: StoryTree): NormalizedStoryData {
    const normalized: NormalizedStoryData = {
        stories: {},
        acts: {},
        scenes: {},
        beats: {},
        scriptlines: {},
        characters: {},
        locations: {}
    };

    // Add story
    normalized.stories[tree.id] = {
        id: tree.id,
        title: tree.title,
        description: tree.description,
        tags: tree.tags,
        createdAt: tree.createdAt,
        updatedAt: tree.updatedAt,
        actIds: tree.acts.map(act => act.id),
        characterIds: tree.characters.map(char => char.id),
        locationIds: tree.locations.map(loc => loc.id)
    };

    // Add characters
    for (const character of tree.characters) {
        normalized.characters[character.id] = character;
    }

    // Add locations
    for (const location of tree.locations) {
        normalized.locations[location.id] = location;
    }

    // Walk the tree:  acts -> scenes -> beats -> scriptlines
    for (const act of tree.acts) {

        const { scenes, ...rest } = act;
        normalized.acts[act.id] = {
            ...rest,
            sceneIds: scenes.map(scene => scene.id)
        };

        for (const scene of act.scenes) {
            const { beats, ...rest } = scene;
            normalized.scenes[scene.id] = {
                ...rest,
                beatIds: beats.map(beat => beat.id)
            };

            for (const beat of scene.beats) {
                const { scriptlines, ...rest } = beat;
                normalized.beats[beat.id] = {
                    ...rest,
                    scriptLineIds: scriptlines.map(line => line.id)
                };

                for (const scriptline of beat.scriptlines) {
                    normalized.scriptlines[scriptline.id] = {
                        ...scriptline,
                    };
                }
            }
        }
    }

    return normalized;
}