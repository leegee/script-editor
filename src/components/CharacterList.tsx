import './CharacterList.scss';
import { Component, For, createSignal, createEffect } from "solid-js";
import CharacterCard from "./CharacterCard";

type CharacterListProps = {
    characterIds: string[];
};

const CharacterList: Component<CharacterListProps> = (props) => {
    // No need to load character data here anymore,
    // since CharacterCard will fetch by characterId itself.
    // We just render CharacterCards directly with IDs.

    return (
        <ul class="character-list">
            <For each={props.characterIds}>
                {(characterId) => (
                    <li>
                        <CharacterCard characterId={characterId} summary={true} />
                    </li>
                )}
            </For>
        </ul>
    );
};

export default CharacterList;
