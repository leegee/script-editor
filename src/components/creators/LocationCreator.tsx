import './LocationCreator.scss';
import { createSignal, createResource, Show, JSX } from 'solid-js';
import { storyApi } from '../../stores/story';
import Modal from '../Modal';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import Map from '../Map';
import { Location } from '../../lib/types';

interface LocationCreatorProps {
    parentId?: string;
    refresh?: () => void;
    children?: JSX.Element;
}

const LocationCreator = (props: LocationCreatorProps) => {
    const [newLocationId, setNewLocationId] = createSignal<string | null>(null);
    const [name, setName] = createSignal('');
    const [description, setDescription] = createSignal('');

    const [savedLocation] = storyApi.useLocation(() => newLocationId());

    const syncState = (loc: Location | null) => {
        setName(loc?.name ?? '');
        setDescription(loc?.description ?? '');
    };

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

    // On cancel, delete the temporary location
    const onCancel = async () => {
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

    const onSave = async () => {
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
            <Show when={newLocationId() && savedLocation()}>
                <Modal title="Create A New Location" open={!!newLocationId()} onClose={onCancel}>
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
                            <button class="cancel" onClick={onCancel}>Cancel</button>
                            <button class="save" onClick={onSave}>Save</button>
                        </footer>
                    </div>
                </Modal>
            </Show>
        </>
    );
};

export default LocationCreator;