import './ActsList.scss';
import { createMemo, For } from 'solid-js';
import ActCard from '../cards/ActCard';
import { storyApi } from '../../stores/story';
import SceneCreator from '../creators/SceneCreator';

const ActsList = () => {
    const acts = createMemo(() => storyApi.getActs());

    return (
        <section class="acts-list" role="list" aria-label="Acts List">
            <For each={acts()}>
                {(act) => <ActCard actId={act.id} summary={true} />}
            </For>
        </section>
    );
};

export default ActsList;
