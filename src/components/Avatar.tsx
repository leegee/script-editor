import './Avatar.scss';
import { storyApi } from '../stores/story';
import { createSignal, createMemo, Show, For, Component } from 'solid-js';
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
    const allCharacters = storyApi.getCharacters();
    const showName = props.showName ?? true;
    const isNew = props.isNew ?? false;

    const [showModal, setShowModal] = createSignal(false);
    const [selectedId, setSelectedId] = createSignal(props.characterId ?? allCharacters[0]?.id);
    const character = createMemo(() => {
        const id = selectedId();
        return id ? storyApi.getCharacter(id) : undefined;
    });

    const characterSelectedChanged = (e) => {
        setSelectedId((e.target as HTMLSelectElement).value);
        if (props.onChange) props.onChange(e);
    }

    return (
        <aside class={`avatar ${props.class ?? ''}`}>
            <Show when={character()}>
                <div
                    class="avatar-circle"
                    style={{ 'background-color': character()!.avatarColor ?? '#999' }}
                >
                    <Show when={character()!.avatarImage} fallback={
                        <div>
                            <button
                                class="avatar-initial"
                                onClick={() => setShowModal(true)}
                                aria-label={`Add an image for ${character()!.name}`}
                            >
                                {character()!.name.substring(0, 1)}
                            </button>
                            <Show when={showModal()}>
                                <Modal title={`Select an image for ${character().name}`} open={showModal()} onClose={() => setShowModal(false)}>
                                    <ImageThumbnail
                                        entityType="characters"
                                        entityId={character()!.id}
                                        field="avatarImage"
                                        alt={character()!.name}
                                        openModal={true}
                                    />
                                </Modal>
                            </Show>
                        </div>
                    }>
                        {/* Show image thumbnail with controlled openModal */}
                        <ImageThumbnail
                            entityType="characters"
                            entityId={character()!.id}
                            field="avatarImage"
                            alt={character()!.name}
                        />
                    </Show>
                </div>

                {/* Select dropdown when NOT isNew */}
                <Show when={!isNew}>
                    <select class='character-name'
                        value={selectedId()}
                        onChange={characterSelectedChanged}
                    >
                        <For each={allCharacters}>
                            {(c) => <option value={c.id}>{c.name}</option>}
                        </For>
                    </select>
                </Show>

                {/* Editable name input when isNew */}
                <Show when={isNew && showName && character()}>
                    <em>
                        <TextInput tooltip='Character Name' {...bindField('characters', character()!.id, 'name')} />
                    </em>
                </Show>
            </Show>
        </aside>
    );
};

export default Avatar;
