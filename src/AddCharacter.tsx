import { createResource, Show, For } from 'solid-js';
import OverflowMenu from './components/OverflowMenu';
import { storyApi } from './stores/story'; // your StoryService singleton

type AddCharacterProps = {
    sceneId: string;
};

export default function AddCharacter(props: AddCharacterProps) {
    // Load characters NOT in the scene
    const [availableCharacters, { refetch }] = createResource(
        () => props.sceneId,
        (sceneId) => this.getCharactersNotInScene(sceneId)
    );

    const handleAdd = async (characterId: string) => {
        await this.linkCharacterToScene(props.sceneId, characterId);
        refetch(); // update available characters
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
                        buttonContent={<span>➕ Add Character</span>}
                    >
                        <ul class="overflow-menu-list">
                            <For each={characters()}>
                                {([id, character]) => (
                                    <li>
                                        <button
                                            type="button"
                                            class="overflow-menu-item"
                                            onClick={() => handleAdd(id)}
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
