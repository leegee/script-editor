import './LocationCreator.scss';
import { createSignal, createResource, Show, JSX } from 'solid-js';
import { storyApi } from '../../stores/story';
import Modal from '../Modal';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import Map from '../Map';
import { Location } from '../../lib/types';

interface LocationCreatorProps {
    parentId?: string; // Optional storyId or actId to link the location
    refresh?: () => void; // Notify parent (e.g., LocationList) of changes
    children?: JSX.Element; // Optional button content
}

const LocationCreator = (props: LocationCreatorProps) => {
    const [newLocationId, setNewLocationId] = createSignal<string | null>(null);
    const [name, setName] = createSignal('');
    const [description, setDescription] = createSignal('');

    // Fetch location data for image preview
    const [savedLocation] = createResource(newLocationId, async (id) => {
        if (!id) return null;
        try {
            const loc = await storyApi.getLocation(id);
            return loc;
        } catch (error) {
            console.error('Failed to fetch location:', error);
            return null;
        }
    });

    // Sync local state with fetched location
    const syncState = (loc: Location | null) => {
        setName(loc?.name ?? '');
        setDescription(loc?.description ?? '');
    };

    // Open modal and create a new location
    const openModal = async () => {
        try {
            const newLocation = await storyApi.createEntity('locations', {
                id: String(Date.now()),
                name: 'New Location',
                description: '',
                geofence: null,
                tags: [],
            }, props.parentId);
            setNewLocationId(newLocation.id);
            syncState(newLocation);
        } catch (error) {
            console.error('Failed to create location:', error);
        }
    };

    // Cancel and delete the temporary location
    const cancel = async () => {
        const id = newLocationId();
        if (id) {
            try {
                await storyApi.deleteEntity('locations', id);
                props.refresh?.();
            } catch (error) {
                console.error('Failed to delete location:', error);
            }
        }
        setNewLocationId(null);
        syncState(null);
    };

    // Save the location and close the modal
    const saveLocation = async () => {
        try {
            const id = newLocationId();
            if (id) {
                await storyApi.updateEntityField('locations', id, 'name', name());
                await storyApi.updateEntityField('locations', id, 'description', description());
                props.refresh?.();
            }
            setNewLocationId(null);
            syncState(null);
        } catch (error) {
            console.error('Failed to save location:', error);
        }
    };

    // Update store and local state on name input
    const onNameInput = (e: InputEvent) => {
        const val = (e.target as HTMLInputElement).value;
        setName(val);
        const id = newLocationId();
        if (id) {
            storyApi.updateEntityField('locations', id, 'name', val).catch((error) => {
                console.error('Failed to update name:', error);
            });
        }
    };

    // Update store and local state on description input
    const onDescriptionInput = (e: InputEvent) => {
        const val = (e.target as HTMLTextAreaElement).value;
        setDescription(val);
        const id = newLocationId();
        if (id) {
            storyApi.updateEntityField('locations', id, 'description', val).catch((error) => {
                console.error('Failed to update description:', error);
            });
        }
    };

    return (
        <>
            <button onClick={openModal}>{props.children ?? 'New Location'}</button>
            <Show when={newLocationId()}>
                <Modal title="Create A New Location" open={!!newLocationId()} onClose={cancel}>
                    <div class="creator-form">
                        <label>
                            <span class="text">Name:</span>
                            <TextInput
                                value={name}
                                onInput={onNameInput}
                            />
                        </label>

                        <label>
                            <span class="text">Description:</span>
                            <TextInput
                                value={description}
                                onInput={onDescriptionInput}
                                as="textarea"
                            />
                        </label>

                        <label>
                            <span class="text">Image (optional):</span>
                            <FileInput
                                entity="locations"
                                id={newLocationId()!}
                                field="photoUrl"
                            />
                            <Show when={savedLocation()?.photoUrl}>
                                <div class="image-preview">
                                    <img src={savedLocation()?.photoUrl} alt="Location photo" />
                                </div>
                            </Show>
                        </label>

                        <Map locationId={newLocationId()!} />

                        <footer class="actions">
                            <button class="cancel" onClick={cancel}>Cancel</button>
                            <button class="save" onClick={saveLocation}>Save</button>
                        </footer>
                    </div>
                </Modal>
            </Show>
        </>
    );
};

export default LocationCreator;