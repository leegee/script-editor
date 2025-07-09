import { Act, Beat, Character, Location, ScriptLine, NormalizedStoryData, Scene, Story, StoryTree } from "./types";

export function denormalizeStoryTree({
    story,
    acts,
    scenes,
    beats,
    scriptlines,
    characters,
    locations
}: {
    story: Story;
    acts: Act[];
    scenes: Scene[];
    beats: Beat[];
    scriptlines: ScriptLine[];
    characters: Character[];
    locations: Location[];
}): StoryTree {
    return {
        ...story,
        characters: characters.filter(c => story.characterIds.includes(c.id)),
        locations: locations.filter(l => story.locationIds.includes(l.id)),
        acts: story.actIds.map(actId => {
            const act = acts.find(a => a.id === actId)!;
            return {
                ...act,

                scenes: act.sceneIds.map(sceneId => {
                    const scene = scenes.find(s => s.id === sceneId)!;

                    return {
                        id: scene.id,
                        number: scene.number,
                        title: scene.title,
                        summary: scene.summary,
                        locationId: scene.locationId,
                        durationSeconds: scene.durationSeconds ?? 0,
                        beatIds: scene.beatIds,
                        beats: scene.beatIds.map(beatId => {
                            const beat = beats.find(b => b.id === beatId)!;
                            return {
                                id: beat.id,
                                number: beat.number,
                                title: beat.title,
                                summary: beat.summary,
                                durationSeconds: beat.durationSeconds ?? 0,
                                scriptLineIds: beat.scriptLineIds,
                                scriptlines: beat.scriptLineIds.map(slId =>
                                    scriptlines.find(sl => sl.id === slId)!
                                )
                            };
                        })
                    };
                })

            };
        })
    };
}
