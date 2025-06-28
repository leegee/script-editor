import './CharacterList.scss';
import { Component, For, createResource, Show } from "solid-js";
import { fakeApi } from "../lib/fakeApi";
import CharacterCard from "./CharacterCard";

type CharacterListProps = {
    characterIds?: string[];
};

const CharacterList: Component<CharacterListProps> = (props) => {
    // Always get all characters
    const [characters] = createResource(() => fakeApi.getCharacters());

    // Filter if needed
    const getCharactersToShow = () =>
        props.characterIds?.length
            ? characters()?.filter(c => props.characterIds!.includes(c.id))
            : characters();

    return (
        <Show when={characters()} fallback={<div>Loading characters...</div>}>
            <section class="character-list">
                <For each={getCharactersToShow()}>
                    {(character) => (
                        <CharacterCard characterId={character.id} summary={true} />
                    )}
                </For>
            </section>
        </Show>
    );
};

export default CharacterList;
