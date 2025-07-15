import './Avatar.scss';
import { storyApi } from '../stores/story';
import {
    createSignal,
    createEffect,
    createResource,
    Show,
    For,
    Component
} from 'solid-js';
import ImageThumbnail from './ImageThumbnail';
import TextInput from './TextInput';
import { bindField } from '../lib/bind-field';
import Modal from './Modal';

interface AvatarProps {
    characterId?: string;
    showName?: boolean;
    class?: string;
    isNew?: boolean;
    onChange?: (e: Event) => void;
}

const Avatar: Component<AvatarProps> = (props) => {
    const [allCharacters] = storyApi.useCharacters();
    const showName = props.showName ?? true;
    const isNew = props.isNew ?? false;

    const [selectedId, setSelectedId] = createSignal(props.characterId);
    const [showModal, setShowModal] = createSignal(false);

    createEffect(() => {
        if (!selectedId() && allCharacters()) {
            const firstId = allCharacters()?.[0]?.id;
            if (firstId) setSelectedId(firstId);
        }
    });

    const [character] = storyApi.useCharacter(() => selectedId());

    const characterSelectedChanged = (e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        setSelectedId(value);
        if (props.onChange) props.onChange(e);
    };

    return (
        <aside class={`avatar ${props.class ?? ''}`}>
            <Show when={character()}>
                {(char) => (
                    <>
                        <div
                            class="avatar-circle"
                            style={{ 'background-color': char().avatarColor ?? '#999' }}
                        >
                            <Show
                                when={char().avatarImage}
                                fallback={
                                    <div>
                                        <button
                                            class="avatar-initial"
                                            onClick={() => setShowModal(true)}
                                            aria-label={`Add an image for ${char().name}`}
                                        >
                                            {char().name.substring(0, 1)}
                                        </button>
                                        <Show when={showModal()}>
                                            <Modal
                                                title={`Select an image for ${char().name}`}
                                                open={showModal()}
                                                onClose={() => setShowModal(false)}
                                            >
                                                <ImageThumbnail
                                                    entityType="characters"
                                                    entityId={char().id}
                                                    field="avatarImage"
                                                    alt={char().name}
                                                    openModal={true}
                                                />
                                            </Modal>
                                        </Show>
                                    </div>
                                }
                            >
                                <ImageThumbnail
                                    entityType="characters"
                                    entityId={char().id}
                                    field="avatarImage"
                                    alt={char().name}
                                />
                            </Show>
                        </div>

                        {/* Select dropdown when NOT isNew */}
                        <Show when={!isNew && allCharacters()}>
                            <select
                                class="character-name"
                                value={selectedId()}
                                onChange={characterSelectedChanged}
                            >
                                <For each={allCharacters()}>
                                    {(c) => <option value={c.id}>{c.name}</option>}
                                </For>
                            </select>
                        </Show>

                        {/* Editable name input when isNew */}
                        <Show when={isNew && showName}>
                            <em>
                                <TextInput
                                    tooltip="Character Name"
                                    {...bindField('characters', char().id, 'name')}
                                />
                            </em>
                        </Show>
                    </>
                )}
            </Show>
        </aside>
    );
};

export default Avatar;
