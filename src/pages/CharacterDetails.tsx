import { type Component, createSignal, createEffect, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import CharacterCard from '../components/CharacterCard';
import { fakeApi } from '../lib/fakeApi';
import type { Character } from '../lib/types';

const CharacterDetails: Component = () => {
    const params = useParams<{ id: string }>();
    const [character, setCharacter] = createSignal<Character | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal<string | null>(null);

    createEffect(() => {
        const id = params.id;
        if (!id) return;

        setLoading(true);
        setError(null);
        setCharacter(null);

        fakeApi.getCharacter(id)
            .then((data) => {
                setCharacter(data);
                setError(null);
            })
            .catch(() => {
                setError('Failed to load character.');
                setCharacter(null);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    return (
        <div class="character-details">
            <Suspense fallback={<p>Loading character...</p>}>
                {loading() && <p>Loading character...</p>}
                {error() && <p class="error">{error()}</p>}
                {!loading() && !error() && !character() && <p>Character not found.</p>}
                {character() && <CharacterCard character={character()!} />}
            </Suspense>
        </div>
    );
};

export default CharacterDetails;
