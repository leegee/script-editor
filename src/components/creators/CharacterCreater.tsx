import './CharacterCreater.scss';
import { storyApi } from "../../lib/story";
import { createSignal, Show } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../Input';

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
        <div class="character-creator">
            <button class='new' onclick={openModal}>New Character</button>

            <Modal open={!!newCharacterId()} onClose={cancel}>
                {newCharacterId() && (() => {
                    const id = newCharacterId()!;
                    const nameField = bindField('characters', id, 'name');
                    const avatarColorField = bindField('characters', id, 'avatarColor');
                    const bioField = bindField('characters', id, 'bio');

                    return (
                        <div>
                            <h2>Create A New Character</h2>

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
                                {/* <input
                                    type="color"
                                    value={avatarColorField.value()}
                                    onInput={avatarColorField.onInput}
                                    onBlur={avatarColorField.onBlur}
                                /> */}
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

                            <div class="actions">
                                <button onClick={saveCharacter}>Save</button>
                                <button onClick={cancel}>Cancel</button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default NewCharacterModal;
