import './CharacterList.scss';
import { Component, createMemo, For, Show } from "solid-js";
import { storyApi } from "../../lib/story";
import CharacterCard from "../cards/CharacterCard";
import CharacterCreator from '../creators/CharacterCreator';

type CharacterListProps = {
    characterIds?: string[];
};

const CharacterList: Component<CharacterListProps> = (props) => {
    const characters = createMemo(() => storyApi.getCharacters());

    const getCharactersToShow = () =>
        props.characterIds?.length
            ? characters()?.filter(c => props.characterIds!.includes(c.id))
            : characters();

    return (
        <section class="character-list">
            <Show when={characters()} fallback={<div>No characters found</div>}>
                <For each={getCharactersToShow()}>
                    {(character) => (
                        <CharacterCard characterId={character.id} summary={true} />
                    )}
                </For>
            </Show>
            <CharacterCreator />
        </section>
    );
};

export default CharacterList;
