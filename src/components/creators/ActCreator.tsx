import './Creator.scss';
import { storyApi } from '../../stores/story';
import { createSignal } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';

const ActCreator = () => {
    const [newActId, setNewActId] = createSignal<string | null>(null);

    const openModal = () => {
        const id = storyApi.createEntity('acts', {
            number: -1,
            title: 'New Act',
            summary: '',
            sceneIds: [],
        });
        setNewActId(id);
    };

    const cancel = () => {
        if (newActId()) {
            storyApi.deleteEntity('acts', newActId()!);
        }
        setNewActId(null);
    };

    const saveAct = () => {
        setNewActId(null);
    };

    return (
        <div class="creator-form">
            <button class="new" onclick={openModal}>Act</button>

            <Modal title="Create New Act" open={!!newActId()} onClose={cancel}>
                {newActId() && (() => {
                    const id = newActId()!;
                    const numberField = bindField('acts', id, 'number');
                    const titleField = bindField('acts', id, 'title');
                    const summaryField = bindField('acts', id, 'summary');

                    return (
                        <div>
                            <label>
                                <span class="text">Number:</span>
                                <TextInput value={numberField.value} as="number" />
                            </label>

                            <label>
                                <span class="text">Title:</span>
                                <TextInput value={titleField.value} />
                            </label>

                            <label>
                                <span class="text">Summary:</span>
                                <TextInput value={summaryField.value} as="textarea" />
                            </label>

                            <footer class="actions">
                                <button class="cancel" onClick={cancel}>Cancel</button>
                                <button class="save" onClick={saveAct}>Save</button>
                            </footer>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default ActCreator;
