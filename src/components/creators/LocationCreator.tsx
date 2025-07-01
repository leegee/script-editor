import './LocationCreator.scss';
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { storyApi } from '../../stores/story';
import Modal from '../Modal';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import Map from '../Map';

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
            <button class="new" onclick={openModal}>Location</button>

            <Modal title='Create A New Location' open={!!newLocationId()} onClose={cancel}>
                {newLocationId() && (() => (
                    <div>
                        <label>
                            <span class="text">Name:</span>
                            <TextInput
                                value={() => name()}
                                onInput={onNameInput}
                            />
                        </label>

                        <label>
                            <span class="text">Description:</span>
                            <TextInput
                                value={() => description()}
                                onInput={onDescriptionInput}
                                as="textarea"
                            />
                        </label>

                        <label>
                            <span class='text'>Image (optional):</span>
                            <FileInput
                                entity="locations"
                                id={newLocationId()}
                                field="photoUrl"
                            />

                            {(() => {
                                const savedLocation = storyApi.getLocation(newLocationId());
                                if (savedLocation?.photoUrl) {
                                    return (
                                        <div class="image-preview">
                                            <img src={savedLocation.photoUrl} alt="Location photo" />
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </label>


                        <Map locationId={newLocationId()} />

                        <footer class="actions">
                            <button class="cancel" onClick={cancel}>Cancel</button>
                            <button class="save" onClick={saveLocation}>Save</button>
                        </footer>
                    </div>
                ))()}
            </Modal>
        </div>
    );
};

export default LocationCreator;
