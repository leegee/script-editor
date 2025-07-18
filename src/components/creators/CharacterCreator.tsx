import './Creator.scss';
import { storyApi } from "../../stores/story";
import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';
import ImageThumbnail from '../ImageThumbnail';

interface CharacterCreatorProps {
    open: boolean;
    onClose: () => void;
}

const CharacterCreator = (props: CharacterCreatorProps) => {
    const [newCharacterId, setNewCharacterId] = createSignal<string | null>(null);

    let prevOpen = false;

    const cancel = () => {
        if (newCharacterId()) {
            storyApi.deleteEntity('characters', newCharacterId());
        }
        setNewCharacterId(null);
        props.onClose();
    };

    const saveCharacter = () => {
        setNewCharacterId(null);
        props.onClose();
    };

    createEffect(() => {
        const isOpen = props.open;

        if (isOpen && !prevOpen) {
            (async () => {
                const newChar = await storyApi.createCharacter();
                setNewCharacterId(newChar.id);
            })();
        }

        prevOpen = isOpen;
    });

    return (
        <Show when={props.open && newCharacterId()}>
            {(id) => {
                console.log('id:', id);
                console.log('typeof id:', typeof id);
                console.log('id():', id());
                console.log('typeof id():', typeof id());
                if (!id) return null;
                const nameField = bindField('characters', id(), 'name');
                const avatarColorField = bindField('characters', id(), 'avatarColor');
                const bioField = bindField('characters', id(), 'bio');

                return (
                    <Modal title="Create A New Character" open={true} onClose={cancel}>
                        <div class='creator-form'>
                            <label>
                                <span class='text'>Name:</span>
                                <TextInput
                                    value={nameField.value}
                                    onInput={nameField.onInput}
                                    onBlur={nameField.onBlur}
                                />
                            </label>

                            <label>
                                <span class='text'>Avatar Color:</span>
                                <TextInput {...avatarColorField} as="color" />
                            </label>

                            <label>
                                <span class='text'>Bio:</span>
                                <TextInput
                                    placeholder='Background of the character'
                                    value={bioField.value}
                                    onInput={bioField.onInput}
                                    onBlur={bioField.onBlur}
                                    as='textarea'
                                />
                            </label>

                            <label>
                                <span class='text'>Image (optional): {id()}</span>
                                <ImageThumbnail entityType='characters' entityId={id()} field='avatarImage' />
                            </label>

                            <footer class="actions">
                                <button class="cancel" onClick={cancel}>Cancel</button>
                                <button class="save" onClick={saveCharacter}>Save</button>
                            </footer>
                        </div>
                    </Modal>
                );
            }}
        </Show>
    );
};

export default CharacterCreator;
