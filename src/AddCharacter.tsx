import { story, setStory } from './stores/story';
import OverflowMenu from './components/OverflowMenu';
import { Show } from 'solid-js';

type AddCharacterProps = {
    sceneId: string;
};

export default function (props: AddCharacterProps) {
    const availableCharacters = () =>
        Object.entries(story.characters).filter(([id]) => {
            const scene = story.scenes[props.sceneId];
            const characterIds = scene?.characterIds ?? [];
            const ids = Array.isArray(characterIds) ? [...characterIds] : [];
            return !ids.includes(id);
        });

    const linkCharacterScene = (sceneId: string, characterId: string) => {
        const scene = story.scenes[sceneId];
        if (!scene) {
            console.warn(`linkCharacterScene: Scene ${sceneId} not found`);
            return;
        }

        // Prevent duplicates
        if (scene.characterIds?.includes(characterId)) {
            return;
        }

        setStory('scenes', sceneId, 'characterIds', (list = []) => [...list, characterId]);

        console.info(`Linked character ${characterId} to scene ${sceneId}`);
    };

    const handleAdd = ([id]: [string, any]) => {
        linkCharacterScene(props.sceneId, id);
    };

    return (
        <Show when={availableCharacters().length} fallback={
            <small>All characters present</small>}
        >
            <OverflowMenu class='none' buttonContent={<span>➕ Add Character</span>}>
                <ul class="overflow-menu-list">
                    {availableCharacters().map(([id, character]) => (
                        <li>
                            <button
                                type="button"
                                class="overflow-menu-item"
                                onClick={() => handleAdd([id, character])}
                            >
                                {character.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </OverflowMenu >
        </Show>
    );
};
