import { NormalizedStoryData, Story } from "./types";

export function denormalizeStoryTree(normalized: NormalizedStoryData): Story {
    const storyId = Object.keys(normalized.stories)[0];
    const story = normalized.stories[storyId];

    const acts = story.actIds.map(actId => {
        const act = normalized.acts[actId];
        const scenes = act.sceneIds.map(sceneId => {
            const scene = normalized.scenes[sceneId];
            const beats = scene.beatIds.map(beatId => {
                const beat = normalized.beats[beatId];
                const scriptLines = beat.scriptLineIds.map(slId => normalized.scriptLines[slId]);
                return { ...beat, scriptLines };
            });
            return { ...scene, beats };
        });
        return { ...act, scenes };
    });

    const characters = story.characterIds.map(charId => normalized.characters[charId]);
    const locations = story.locationIds.map(locId => normalized.locations[locId]);

    return {
        id: story.id,
        title: story.title,
        description: story.description,
        acts,
        characters,
        locations,
        tags: story.tags,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
    };
}
