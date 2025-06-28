import './ActsList.scss';
import { For } from 'solid-js';
import type { Act } from '../lib/types';
import ActCard from './ActCard';

interface ActsListProps {
    acts: Act[];
}

export default (props: ActsListProps) => {
    return (
        <section class="acts-list" role="list" aria-label="Acts List">
            <For each={props.acts}>
                {(act) => (
                    <ActCard actId={act.id} summary={true} />
                )}
            </For>
        </section>
    );
};

