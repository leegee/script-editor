import { type Component, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import ActCard from '../components/ActCard';

const ActDetails: Component = () => {
    const params = useParams<{ id: string }>();

    return (
        <section class="act-details">
            <Show when={params.id} fallback={<p>Act ID is missing.</p>}>
                <ActCard actId={params.id} summary={false} />
            </Show>
        </section>
    );
};

export default ActDetails;
