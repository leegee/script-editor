import './Creator.scss';
import { storyApi } from '../../stores/story';
import { createSignal, Show } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';

const ActCreator = () => {
    const [newActId, setNewActId] = createSignal<string | null>(null);

    const openModal = async () => {
        const actId = await storyApi.createEntity('acts', {
            id: crypto.randomUUID(),
            number: await storyApi.getNextInSequence('acts'),
            title: 'New Act',
            summary: '',
            sceneIds: [],
        });
        setNewActId(actId.id);
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
        <div>
            <button onclick={openModal}>New Act</button>

            <Show when={newActId}>
                <Modal title="Create New Act" open={!!newActId()} onClose={cancel}>
                    {newActId() && (() => {
                        const id = newActId()!;
                        const numberField = bindField('acts', id, 'number');
                        const titleField = bindField('acts', id, 'title');
                        const summaryField = bindField('acts', id, 'summary');

                        return (
                            <div class="creator-form">
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
            </Show>
        </div>
    );
};

export default ActCreator;
