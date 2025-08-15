import { type Component, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import SceneCard from '../components/cards/SceneCard';

const SceneDetails: Component = () => {
    const params = useParams<{ id: string }>();

    return (
        <section class="scene-details">
            <Show when={params.id} fallback={<p>Scene ID is missing.</p>}>
                <SceneCard sceneId={params.id} summary={false} />
            </Show>
        </section>
    );
};

export default SceneDetails;
