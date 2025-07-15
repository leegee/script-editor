import { createResource, Show, For } from 'solid-js';
import OverflowMenu from './components/OverflowMenu';
import { storyApi } from './stores/story';

type AddCharacterProps = {
    sceneId: string;
};

export default function AddCharacter(props: AddCharacterProps) {
    const [availableCharacters] = storyApi.useCharactersNotInScene(() => props.sceneId);

    const handleAdd = async (characterId: string) => {
        await storyApi.linkCharacterToScene(props.sceneId, characterId);
    };

    return (
        <Show when={availableCharacters()} fallback={<small>Loading characters...</small>}>
            {(characters) => (
                <Show
                    when={characters.length > 0}
                    fallback={<small>All characters present</small>}
                >
                    <OverflowMenu
                        class="none"
                        buttonContent={<span class='new'>Add Character</span>}
                    >
                        <ul class="overflow-menu-list">
                            <For each={characters()}>
                                {(character) => (
                                    <li>
                                        <button
                                            type="button"
                                            class="overflow-menu-item"
                                            onClick={() => handleAdd(character.id)}
                                        >
                                            {character.name}
                                        </button>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </OverflowMenu>
                </Show>
            )}
        </Show>
    );
}
