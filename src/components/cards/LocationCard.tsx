import './LocationCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Location } from '../../lib/types';
import { storyApi } from '../../lib/story';
import Map from '../Map';
import Card from './Card';
import LocationPinIcon from '../icons/LocationPin';
import { bindField } from '../../lib/bind-field';
import TextInput from '../TextInput';

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
                    link={props.summary ? `/location/${loc.id}` : undefined}
                    label={`View details for ${loc.name}`}
                    summary={!!props.summary}
                    class="location-card"
                    title={
                        <span class='location-heading'>
                            <LocationPinIcon />
                            <TextInput value={() => loc.name} onInput={onNameInput} />
                        </span>
                    } >

                    <h5>Description</h5>
                    <TextInput value={() => loc.description} onInput={onDescriptionInput} as="textarea" />

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
