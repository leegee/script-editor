import { type Component, Show, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import CharacterCard from '../components/CharacterCard';

const CharacterDetails: Component = () => {
    const params = useParams<{ id: string }>();

    return (
        <div class="character-details">
            <Show when={params.id} fallback={<p class="error">No character ID provided.</p>}>
                <CharacterCard characterId={params.id} summary={false} />
            </Show>
        </div>
    );
};

export default CharacterDetails;

