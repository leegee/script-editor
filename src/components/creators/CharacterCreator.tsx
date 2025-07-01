import './Creator.scss';
import { storyApi } from "../../lib/story";
import { createSignal, Show } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';
import FileInput from '../FileInput';

const NewCharacterModal = () => {
    const [newCharacterId, setNewCharacterId] = createSignal<string | null>(null);

    const openModal = () => {
        const newCharacterId = storyApi.createEntity('characters', {
            name: 'New Character',
            avatarColor: 'pink',
            avatarImage: '',
        });
        setNewCharacterId(newCharacterId);
    };

    const cancel = () => {
        if (newCharacterId()) {
            storyApi.deleteEntity('characters', newCharacterId()!);
        }
        setNewCharacterId(null);
    };

    const saveCharacter = () => {
        setNewCharacterId(null);
    };

    return (
        <div class="creator-form">
            <button class='new' onclick={openModal}>New Character</button>

            <Modal title="Create A New Character" open={!!newCharacterId()} onClose={cancel}>
                {newCharacterId() && (() => {
                    const id = newCharacterId()!;
                    const nameField = bindField('characters', id, 'name');
                    const avatarColorField = bindField('characters', id, 'avatarColor');
                    const bioField = bindField('characters', id, 'bio');

                    return (
                        <div>
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
                                    value={bioField.value}
                                    onInput={bioField.onInput}
                                    onBlur={bioField.onBlur}
                                    as='textarea'
                                />
                            </label>

                            <label>
                                <span class='text'>Image (optional):</span>
                                <FileInput
                                    entity="characters"
                                    id={newCharacterId()}
                                    field="avatarImage"
                                />
                            </label>

                            <footer class="actions">
                                <button class="cancel" onClick={cancel}>Cancel</button>
                                <button class="save" onClick={saveCharacter}>Save</button>
                            </footer>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default NewCharacterModal;
