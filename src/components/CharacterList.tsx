import './CharacterList.scss';
import { Component, For, createSignal, onMount } from "solid-js";
import type { Character } from "../lib/types";
import CharacterCard from "./CharacterCard";
import { fakeApi } from '../lib/fakeApi';

interface CharacterListWithCharacters {
    characters: Character[];
    characterIds?: never;
}

interface CharacterListWithIds {
    characters?: never;
    characterIds: string[];
}

type CharacterListProps = (CharacterListWithCharacters | CharacterListWithIds);

const CharacterList: Component<CharacterListProps> = (props) => {
    const [characters, setCharacters] = createSignal<Character[]>([]);

    onMount(async () => {
        if ("characterIds" in props && props.characterIds?.length) {
            const loaded: Character[] = await Promise.all(
                props.characterIds.map((id) =>
                    fakeApi.getCharacter(id).catch(() => null)
                )
            );
            setCharacters(loaded.filter((c): c is Character => c !== null));
        } else if ("characters" in props && props.characters?.length) {
            setCharacters(props.characters);
        }
    });

    return (
        <ul class="character-list">
            <For each={characters()}>
                {(character) => (
                    <li>
                        <CharacterCard character={character} link-to-main={true} />
                    </li>
                )}
            </For>
        </ul>
    );
};

export default CharacterList;
