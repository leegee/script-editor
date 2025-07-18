import { type Component, For, Show } from 'solid-js';
import BeatCard from '../cards/BeatCard';
import { storyApi } from '../../stores/story';

interface BeatListProps {
    sceneId: string;
}

const BeatList: Component<BeatListProps> = (props) => {
    const [beats] = storyApi.useBeatsBySceneId(() => props.sceneId);

    return (
        <Show when={beats() && beats().length > 0} fallback={<h2 class='no-cntent'>No beats found</h2>}>
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
