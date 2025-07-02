import './LocationCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Location } from '../../lib/types';
import { storyApi } from '../../stores/story';
import Map from '../Map';
import Card from './Card';
import LocationPinIcon from '../icons/LocationPin';
import TextInput from '../TextInput';
import FileInput from '../FileInput';
import ImageThumbnail from '../ImageThumbnail';
import DeleteLocationButton from '../delete-buttons/DeleteLocationButton';

type LocationCardProps = {
    summary?: boolean;
    locationId?: string;
    location?: Location;
};

const LocationCard: Component<LocationCardProps> = (props) => {
    const location = createMemo<Location | undefined>(() => {
        if (props.location) return props.location;
        if (props.locationId) {
            return storyApi.getLocation(props.locationId);
        }
        return undefined;
    });

    const onNameInput = (e: InputEvent) => {
        const val = (e.target as HTMLInputElement).value;
        storyApi.updateEntity('locations', location().id, 'name', val);
    };

    const onDescriptionInput = (e: InputEvent) => {
        const val = (e.target as HTMLTextAreaElement).value;
        storyApi.updateEntity('locations', location().id, 'description', val);
    };

    return (
        <Show
            when={location()}
            keyed
            fallback={<div class="loading">Loading location...</div>}
        >
            {(loc) => (
                <Card
                    link={`/location/${loc.id}`}
                    label={`View details for ${loc.name}`}
                    summary={!!props.summary}
                    class="location-card"
                    title={
                        <span class='location-heading'>
                            <LocationPinIcon />
                            <TextInput value={() => loc.name} onInput={onNameInput} />
                        </span>
                    }
                    menuItems={<DeleteLocationButton locationId={location().id} />}
                >
                    <h5>Description</h5>
                    <div class='location-desc-and-photo'>
                        <TextInput value={() => loc.description} onInput={onDescriptionInput} as="textarea" />
                        <ImageThumbnail entityType='locations' entityId={location().id} field='photoUrl' />
                    </div>

                    <Map locationId={loc.id} summary={props.summary} />

                    <Show when={loc.tags?.length}>
                        <div class="tags">
                            <For each={loc.tags}>
                                {(tag) => <span class="tag">{tag}</span>}
                            </For>
                        </div>
                    </Show>
                </Card>
            )}
        </Show>
    );
};

export default LocationCard;
