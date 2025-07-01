import './Creator.scss';
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { storyApi } from '../../lib/story';
import Modal from '../Modal';
import TextInput from '../TextInput';

const LocationCreator = () => {
    const [newLocationId, setNewLocationId] = createSignal<string | null>(null);
    const [name, setName] = createSignal('');
    const [description, setDescription] = createSignal('');

    // When modal opens, initialize local state from the store
    createEffect(() => {
        const id = newLocationId();
        if (id) {
            const loc = storyApi.getLocation(id);
            setName(loc?.name ?? '');
            setDescription(loc?.description ?? '');
        }
    });

    const openModal = () => {
        const id = storyApi.createEntity('locations', {
            name: 'New Location',
            description: '',
            geofence: null,
            tags: [],
        });
        setNewLocationId(id);
    };

    const cancel = () => {
        if (newLocationId()) {
            storyApi.deleteEntity('locations', newLocationId()!);
        }
        setNewLocationId(null);
    };

    const saveLocation = () => {
        setNewLocationId(null);
    };

    // Update store when inputs change
    const onNameInput = (e: InputEvent) => {
        const val = (e.target as HTMLInputElement).value;
        setName(val);
        if (newLocationId()) {
            storyApi.updateEntity('locations', newLocationId()!, 'name', val);
        }
    };

    const onDescriptionInput = (e: InputEvent) => {
        const val = (e.target as HTMLTextAreaElement).value;
        setDescription(val);
        if (newLocationId()) {
            storyApi.updateEntity('locations', newLocationId()!, 'description', val);
        }
    };

    return (
        <div class="creator-form">
            <button class="new" onclick={openModal}>New Location</button>

            <Modal open={!!newLocationId()} onClose={cancel}>
                {newLocationId() && (() => (
                    <div>
                        <h2>Create A New Location</h2>

                        <label>
                            <span class="text">Name:</span>
                            <TextInput
                                value={() => name()}
                                onInput={onNameInput}
                                onBlur={() => {/* optional: handle blur */ }}
                            />
                        </label>

                        <label>
                            <span class="text">Description:</span>
                            <TextInput
                                value={() => description()}
                                onInput={onDescriptionInput}
                                as="textarea"
                                onBlur={() => {/* optional */ }}
                            />
                        </label>

                        {/* Add UI for geofence, tags here if you want */}

                        <div class="actions">
                            <button onClick={saveLocation}>Save</button>
                            <button onClick={cancel}>Cancel</button>
                        </div>
                    </div>
                ))()}
            </Modal>
        </div>
    );
};

export default LocationCreator;
