import './ActsList.scss';
import { For } from 'solid-js';
import ActCard from '../cards/ActCard';
import { storyApi } from '../../lib/story';

const ActsList = () => {
    const acts = storyApi.getActs();

    return (
        <section class="acts-list" role="list" aria-label="Acts List">
            <For each={acts}>
                {(act) => <ActCard actId={act.id} summary={true} />}
            </For>
        </section>
    );
};

export default ActsList;
