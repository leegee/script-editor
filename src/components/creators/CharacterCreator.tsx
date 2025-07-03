import './Creator.scss';
import { storyApi } from "../../stores/story";
import { createEffect, createSignal, Show } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';
import ImageThumbnail from '../ImageThumbnail';

const NewCharacterModal = () => {
    const [newCharacterId, setNewCharacterId] = createSignal<string | null>(null);

    const handleClick = () => {
        const _newCharacterId = storyApi.createEntity('characters', {
            name: 'New Character',
            bio: '',
            avatarColor: 'red',
            avatarImage: '',
        });
        setNewCharacterId(_newCharacterId);
    };

    const cancel = () => {
        if (newCharacterId()) {
            storyApi.deleteEntity('characters', newCharacterId());
        }
        setNewCharacterId(null);
    };

    const saveCharacter = () => {
        setNewCharacterId(null);
    };

    return (
        <>
            <button onClick={handleClick}>New Character</button>
            <Show when={newCharacterId()}>
                {(id) => {
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
                                    <span class='text'>Image (optional):</span>
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
        </>
    );
};

export default NewCharacterModal;
