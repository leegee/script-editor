import './LocationCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Location } from '../lib/types';
import { storyApi } from '../lib/story';
import Map from './Map';
import Card from './Card';
import LocationPinIcon from './icons/LocationPin';

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
                    title={<><LocationPinIcon /> {loc.name}</>}
                >
                    <Show when={loc.description}>
                        <p class="description">{loc.description}</p>
                    </Show>

                    <Show when={loc.geofence} keyed>
                        {(geofence) => <Map geofence={geofence} summary={props.summary} />}
                    </Show>

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
