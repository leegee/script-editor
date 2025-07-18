import './CharacterList.scss';
import { Component, createMemo, createResource, For, Show } from "solid-js";
import { storyApi } from "../../stores/story";
import CharacterCard from "../cards/CharacterCard";

type CharacterListProps = {
    characterIds?: string[];
    sceneId?: string;
    actId?: string;
};

const CharacterList: Component<CharacterListProps> = (props) => {
    const actId = () => props.actId;
    const sceneId = () => props.sceneId;
    const characterIds = () => props.characterIds;

    const [allCharacters] = storyApi.useAllCharacters();
    const [charactersInAct] = storyApi.useAllCharactersInActById(actId);
    const [charactersInScene] = storyApi.useAllCharactersInScene(sceneId);

    const characters = createMemo(() => {
        if (actId()) return charactersInAct();
        if (sceneId()) return charactersInScene();
        if (characterIds()?.length) {
            return allCharacters()?.filter(c => characterIds()?.includes(c.id));
        }
        return allCharacters();
    });

    return (
        <section class="character-list">
            <Show when={characters()?.length} fallback={<h2 class='no-cntent'>No characters found</h2>}>
                <For each={characters()}>
                    {(character) => (
                        <CharacterCard editable={false} characterId={character.id} summary sceneId={props.sceneId} />
                    )}
                </For>
            </Show>
        </section>
    );
};

export default CharacterList;
