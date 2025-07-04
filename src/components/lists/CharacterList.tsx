import './CharacterList.scss';
import { Component, createMemo, For, Show } from "solid-js";
import { story, storyApi } from "../../stores/story";
import CharacterCard from "../cards/CharacterCard";

type CharacterListProps = {
    characterIds?: undefined;
    sceneId?: undefined;
    actId?: undefined;
} | {
    characterIds: string[];
    sceneId?: undefined;
    actId?: undefined;
} | {
    characterIds?: undefined;
    sceneId?: undefined;
    actId: string;
};

const CharacterList: Component<CharacterListProps> = (props) => {
    const getCharactersToShow = createMemo(() => {
        if (props.actId) {
            const act = story.acts[props.actId];
            if (!act) return [];
            return storyApi.getCharactersInAct(act);
        } else {
            const allCharacters = createMemo(() => storyApi.getCharacters());
            if (props.characterIds?.length) {
                return allCharacters()?.filter(c => props.characterIds!.includes(c.id)) ?? [];
            } else {
                return allCharacters() ?? [];
            }
        }
    });

    return (
        <section class="character-list">
            <Show when={getCharactersToShow().length > 0} fallback={<div>No characters found</div>}>
                <For each={getCharactersToShow()}>
                    {(character) => (
                        <CharacterCard characterId={character.id} summary={true} sceneId={props.sceneId} />
                    )}
                </For>
            </Show>
        </section>
    );
};

export default CharacterList;
