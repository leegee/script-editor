import './LocationCreator.scss';
import { createSignal, createEffect, Show } from 'solid-js';
import { storyApi } from '../../stores/story';
import Modal from '../Modal';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import Map from '../Map';
import { bindField } from '../../lib/bind-field';

interface LocationCreatorProps {
    open: boolean;
    onClose: () => void;
    parentId?: string;
}

const LocationCreator = (props: LocationCreatorProps) => {
    const [newLocationId, setNewLocationId] = createSignal<string | null>(null);
    const [prevOpen, setPrevOpen] = createSignal(false);

    // Create new location only when modal opens for the first time
    createEffect(() => {
        const isOpen = props.open;
        console.log('Create Location a:', props.open, prevOpen());
        if (isOpen && !prevOpen()) {
            console.log('Create Location');

            (async () => {
                try {
                    const newLocation = await storyApi.createEntity('locations', {
                        id: String(Date.now()),
                        name: 'New Location',
                        description: '',
                        geofence: null,
                        tags: [],
                    }, props.parentId);
                    setNewLocationId(newLocation.id);
                    console.log('New Location created:', newLocation);
                } catch (error) {
                    console.error('Failed to create location:', error);
                }
            })();
        }
        setPrevOpen(isOpen);
    });

    const onCancel = async () => {
        const id = newLocationId();
        if (id) {
            try {
                await storyApi.deleteEntity('locations', id);
            } catch (error) {
                console.error('Failed to delete location:', error);
            }
        }
        setNewLocationId(null);
        props.onClose();
    };

    const onSave = () => {
        setNewLocationId(null);
        props.onClose();
    };

    return (
        <Show when={props.open && newLocationId()}>
            {(id) => {
                if (!id) return null;

                // Bind reactive fields
                const nameField = bindField('locations', id(), 'name');
                const descriptionField = bindField('locations', id(), 'description');

                return (
                    <Modal title="Create A New Location" open={true} onClose={onCancel}>
                        <div class="creator-form">
                            <label>
                                <span class="text">Name:</span>
                                <TextInput
                                    value={nameField.value}
                                    onInput={nameField.onInput}
                                    onBlur={nameField.onBlur}
                                />
                            </label>

                            <label>
                                <span class="text">Description:</span>
                                <TextInput
                                    value={descriptionField.value}
                                    onInput={descriptionField.onInput}
                                    onBlur={descriptionField.onBlur}
                                    as="textarea"
                                />
                            </label>

                            <label>
                                <span class="text">Image (optional):</span>
                                <FileInput
                                    entity="locations"
                                    id={id()}
                                    field="photoUrl"
                                />
                                {/* Show image preview if photoUrl exists */}
                                <Show when={bindField('locations', id(), 'photoUrl').value()}>
                                    {(photoUrl) => (
                                        <div class="image-preview">
                                            <img src={photoUrl()} alt="Location photo" />
                                        </div>
                                    )}
                                </Show>
                            </label>

                            <Map locationId={id()} />

                            <footer class="actions">
                                <button class="cancel" onClick={onCancel}>Cancel</button>
                                <button class="save" onClick={onSave}>Save</button>
                            </footer>
                        </div>
                    </Modal>
                );
            }}
        </Show>
    );
};

export default LocationCreator;
