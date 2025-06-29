import { type Component, For, createMemo } from 'solid-js';
import { useParams } from '@solidjs/router';
import ActCard from '../components/ActCard';
import { fakeApi } from '../lib/fakeApi';

const ActDetails: Component = () => {
    const params = useParams<{ id: string }>();

    const acts = createMemo(() => {
        if (params.id) {
            const act = fakeApi.getAct(params.id);
            return act ? [act] : [];
        }
        return fakeApi.getActs();
    });

    return (
        <section class="act-details">
            <h2>Acts</h2>
            <section class="acts-list" role="list" aria-label="Acts List">
                <For each={acts()}>
                    {(act) => (
                        <ActCard actId={act.id} summary={false} />
                    )}
                </For>
            </section>
        </section>
    );
};

export default ActDetails;
