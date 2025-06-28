import { type Component, For, Show, createMemo } from 'solid-js';
import BeatCard from './BeatCard';
import { story } from '../lib/fakeApi';

interface BeatListProps {
    sceneId: string;
}

const BeatList: Component<BeatListProps> = (props) => {
    // Get the beats for the scene from the normalized store
    const beats = createMemo(() => {
        const scene = story.scenes[props.sceneId];
        if (!scene) return [];
        // Map scene's beatIds to actual beat objects, filter out any missing
        return scene.beatIds.map(id => story.beats[id]).filter(Boolean);
    });

    return (
        <Show when={beats().length > 0} fallback={<p>No beats found.</p>}>
            <section class="beat-list" role="list" aria-label="Beats List">
                <For each={beats()}>
                    {(beat) => (
                        <BeatCard sceneId={props.sceneId} beatId={beat.id} summary={false} />
                    )}
                </For>
            </section>
        </Show>
    );
};

export default BeatList;
