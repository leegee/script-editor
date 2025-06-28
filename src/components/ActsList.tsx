import './ActsList.scss';
import { For } from 'solid-js';
import ActCard from './ActCard';
import { fakeApi } from '../lib/fakeApi';

const ActsList = () => {
    const acts = fakeApi.getActs();

    return (
        <section class="acts-list" role="list" aria-label="Acts List">
            <For each={acts}>
                {(act) => <ActCard actId={act.id} summary={true} />}
            </For>
        </section>
    );
};

export default ActsList;
