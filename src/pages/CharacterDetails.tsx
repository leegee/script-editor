import { type Component, For, createMemo } from 'solid-js';
import { useParams } from '@solidjs/router';
import CharacterCard from '../components/cards/CharacterCard';
import { storyApi } from '../stores/story';

const CharacterDetails: Component = () => {
    const params = useParams<{ id: string }>();

    const characters = createMemo(() => {
        if (params.id) {
            const character = storyApi.getCharacter(params.id);
            return character ? [character] : [];
        }
        return storyApi.getCharacters();
    });

    return (
        <section class="character-details">
            <section class="characters-list" role="list" aria-label="Characters List">
                <For each={characters()}>
                    {(character) => (
                        <CharacterCard characterId={character.id} summary={false} />
                    )}
                </For>
            </section>
        </section>
    );
};

export default CharacterDetails;
