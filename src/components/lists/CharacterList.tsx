import './CharacterList.scss';
import { Component, createResource, For, Show } from "solid-js";
import { storyApi } from "../../stores/story";
import CharacterCard from "../cards/CharacterCard";

type CharacterListProps = {
    characterIds?: string[];
    sceneId?: string;
    actId?: string;
    refresh?: Date;
};

const CharacterList: Component<CharacterListProps> = (props) => {
    const [characters] = createResource(
        () => [props.actId, props.sceneId, props.characterIds, props.refresh],
        async () => {
            if (props.actId) {
                return await storyApi.getCharactersInActById(props.actId);
            }
            if (props.sceneId) {
                return await storyApi.getCharactersInSceneById(props.sceneId);
            }

            const allCharacters = await storyApi.getCharacters();
            if (props.characterIds?.length) {
                return allCharacters.filter(c => props.characterIds!.includes(c.id));
            }
            return allCharacters;
        }
    );

    return (
        <section class="character-list">
            <Show when={characters()?.length} fallback={<div>No characters found</div>}>
                <For each={characters()}>
                    {(character) => (
                        <CharacterCard characterId={character.id} summary={true} sceneId={props.sceneId} />
                    )}
                </For>
            </Show>
        </section>
    );
};

export default CharacterList;
