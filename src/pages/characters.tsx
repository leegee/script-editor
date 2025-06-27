// src/pages/characters.tsx
import { createAsync } from '@solidjs/router';
import { Suspense } from 'solid-js';
import CharacterList from '../components/CharacterList';
import { fakeApi } from '../lib/fakeApi';

export default function Characters() {
    const characters = createAsync(fakeApi.getCharacters);

    return (
        <section>
            <h1>Character List</h1>

            <Suspense fallback={<span>Loading characters...</span>}>
                <CharacterList characters={characters()} />
            </Suspense>
        </section>
    );
}
