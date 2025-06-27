import './CharacterList.scss';
import { Component, For } from "solid-js";
import type { Character } from "../lib/types";
import CharacterCard from "./CharacterCard";

interface CharacterListProps {
    characters: Character[];
}

const CharacterList: Component<CharacterListProps> = (props) => {
    return (
        <section>
            <ul>
                <For each={props.characters}>
                    {(character) => (
                        <li>
                            <CharacterCard character={character} link-to-main={true} />
                        </li>
                    )}
                </For>
            </ul>
        </section>
    );
};

export default CharacterList;
