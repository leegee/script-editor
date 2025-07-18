import './LocationCreator.scss';
import { createSignal, createEffect, Show, JSX, createMemo } from 'solid-js';
import { storyApi } from '../../stores/story';
import Modal from '../Modal';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import Map from '../Map';
import { Location } from '../../lib/types';
import { bindField } from '../../lib/bind-field';

interface LocationCreatorProps {
    open: boolean;
    onClose: () => void;
    parentId?: string;
}

const LocationCreator = (props: LocationCreatorProps) => {
    const [newLocationId, setNewLocationId] = createSignal<string | null>(null);

    const savedLocation = createMemo(() => {
        const id = newLocationId();
        if (!id) return undefined;
        const [locSignal] = storyApi.useLocation(() => id);
        return locSignal;
    });

    createEffect(() => {
        if (props.open && !newLocationId()) {
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
                } catch (error) {
                    console.error('Failed to create location:', error);
                }
            })();
        }
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

    const onSave = async () => {
        try {
            setNewLocationId(null);
            props.onClose();
        } catch (error) {
            console.error('Failed to save location:', error);
        }
    };

    return (
        <Show when={props.open}>
            <Modal title="Create A New Location" open={true} onClose={onCancel}>
                <Show when={savedLocation()?.()}>
                    {(loc) =>
                        <div class="creator-form">
                            <label>
                                <span class="text">Name:</span>
                                <TextInput {...bindField('locations', loc().id, 'name')} />
                            </label>

                            <label>
                                <span class="text">Description:</span>
                                <TextInput {...bindField('locations', loc().id, 'description')} as='textarea' />
                            </label>

                            <label>
                                <span class="text">Image (optional):</span>
                                <FileInput
                                    entity="locations"
                                    id={loc().id}
                                    field="photoUrl"
                                />
                                <Show when={loc().photoUrl}>
                                    <div class="image-preview">
                                        <img src={loc().photoUrl} alt="Location photo" />
                                    </div>
                                </Show>
                            </label>

                            <Map locationId={loc().id} />

                            <footer class="actions">
                                <button class="cancel" onClick={onCancel}>Cancel</button>
                                <button class="save" onClick={onSave}>Save</button>
                            </footer>
                        </div>
                    }
                </Show>
            </Modal>
        </Show >
    );
};

export default LocationCreator;
