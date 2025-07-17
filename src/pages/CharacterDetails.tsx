import { type Component, createResource, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import CharacterCard from '../components/cards/CharacterCard';
import { storyApi } from '../stores/story';

const CharacterDetails: Component = () => {
    const params = useParams<{ id: string }>();


    const [singleCharacter] = storyApi.useCharacter(() => params.id);
    const [allCharacters] = storyApi.useAllCharacters();

    const getCharacters = () => {
        if (params.id) {
            const c = singleCharacter();
            return c ? [c] : [];
        } else {
            return allCharacters() ?? [];
        }
    };

    return (
        <section class="character-details">
            <section class="characters-list" role="list" aria-label="Characters List">
                <For each={getCharacters()}>
                    {(character) => (
                        <CharacterCard editable={true} characterId={character.id} summary={false} />
                    )}
                </For>
            </section>
        </section>
    );
};

export default CharacterDetails;
