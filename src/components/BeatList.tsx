import { type Component, For, Show, createMemo } from 'solid-js';
import BeatCard from './BeatCard';
import { storyApi, story } from '../lib/story';

interface BeatListProps {
    sceneId: string;
}

const BeatList: Component<BeatListProps> = (props) => {
    const beats = createMemo(() => storyApi.getBeatsBySceneId(props.sceneId));

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
