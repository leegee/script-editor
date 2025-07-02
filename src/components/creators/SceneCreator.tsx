import './Creator.scss';
import { storyApi } from '../../stores/story';
import { createSignal } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';

interface SceneCreatorProps {
    actId: string;
}

const SceneCreator = (props: SceneCreatorProps) => {
    const [newSceneId, setNewSceneId] = createSignal<string | null>(null);

    const openModal = () => {
        const id = storyApi.createEntity('scenes', {
            number: storyApi.getNextInSequence('scenes'),
            title: 'New Scene',
            summary: '',
            characterIds: [],
            locationId: undefined,
            durationSeconds: undefined,
            beatIds: [],
        }, {
            parentType: 'acts',
            parentId: props.actId,
            parentListField: 'sceneIds',
        });
        setNewSceneId(id);
    };

    const cancel = () => {
        if (newSceneId()) {
            storyApi.deleteEntity('scenes', newSceneId()!);
        }
        setNewSceneId(null);
    };

    const saveScene = () => {
        setNewSceneId(null);
    };

    return (
        <div class="creator-form">
            <button class="new" onClick={openModal}>Scene</button>

            <Modal title="Create New Scene" open={!!newSceneId()} onClose={cancel}>
                {newSceneId() && (() => {
                    const id = newSceneId()!;

                    const titleField = bindField('scenes', id, 'title');
                    const summaryField = bindField('scenes', id, 'summary');
                    const locationField = bindField('scenes', id, 'locationId');
                    const durationField = bindField('scenes', id, 'durationSeconds');
                    const numberField = bindField('scenes', id, 'number');

                    return (
                        <div>
                            <label>
                                <span class="text">Scene Number:</span>
                                <TextInput value={numberField.value} as='number' />
                            </label>

                            <label>
                                <span class="text">Title:</span>
                                <TextInput value={titleField.value} />
                            </label>

                            <label>
                                <span class="text">Summary:</span>
                                <TextInput value={summaryField.value} as="textarea" />
                            </label>

                            <label>
                                <span class="text">Location ID:</span>
                                <TextInput value={locationField.value} />
                                {/* Replace with <select> if you have a list of locations */}
                            </label>

                            <label>
                                <span class="text">Duration (seconds):</span>
                                <TextInput value={durationField.value} as="number" />
                            </label>

                            <footer class="actions">
                                <button class="cancel" onClick={cancel}>Cancel</button>
                                <button class="save" onClick={saveScene}>Save</button>
                            </footer>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default SceneCreator;
