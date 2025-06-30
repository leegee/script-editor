import './CharacterList.scss';
import { Component, For, Show } from "solid-js";
import { storyApi } from "../../lib/story";
import CharacterCard from "../cards/CharacterCard";

type CharacterListProps = {
    characterIds?: string[];
};

const CharacterList: Component<CharacterListProps> = (props) => {
    const characters = () => storyApi.getCharacters();

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

                <button class="new">Add character</button>

            </section>
        </Show>
    );
};

export default CharacterList;
