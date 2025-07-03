import './Creator.scss';
import { storyApi } from '../../stores/story';
import { createMemo, createSignal } from 'solid-js';
import { bindField } from '../../lib/bind-field';
import Modal from '../Modal';
import TextInput from '../TextInput';
import AddLocation from '../../AddLocation';
import LocationCard from '../cards/LocationCard';

interface SceneCreatorProps {
    actId: string;
}

const SceneCreator = (props: SceneCreatorProps) => {
    const [newSceneId, setNewSceneId] = createSignal<string | null>(null);

    const openModal = () => {
        const id = storyApi.addNewSceneToAct(props.actId);
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
        <div>
            <button onClick={openModal}>New Scene</button>

            <Modal title="Create New Scene" open={!!newSceneId()} onClose={cancel}>
                {newSceneId() && (() => {
                    const sceneId = newSceneId()!;

                    const titleField = bindField('scenes', sceneId, 'title');
                    const summaryField = bindField('scenes', sceneId, 'summary');
                    const durationField = bindField('scenes', sceneId, 'durationSeconds');
                    const numberField = bindField('scenes', sceneId, 'number');
                    const locationId = createMemo<string>(() => storyApi.getLocationForScene(sceneId)?.id);

                    return (
                        <div class='creator-form'>
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

                            <label class='locations'>
                                <LocationCard sceneId={sceneId} locationId={locationId()} summary />
                                <AddLocation sceneId={sceneId} />
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
