import { type Component, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import CharacterCard from '../components/CharacterCard';

const CharacterDetails: Component = () => {
    const params = useParams<{ id: string }>();
    const characterId = params.id;

    if (!characterId) {
        return <p class="error">No character ID provided.</p>;
    }

    return (
        <div class="character-details">
            <Suspense fallback={<p>Loading character...</p>}>
                <CharacterCard characterId={characterId} summary={false} />
            </Suspense>
        </div>
    );
};

export default CharacterDetails;
