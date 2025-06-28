import './LocationCard.scss';
import { type Component, Show, For, createMemo, createSignal } from 'solid-js';
import type { Location } from '../lib/types';
import { story } from '../lib/fakeApi';
import Map from './Map';
import Card from './Card';
import LocationPinIcon from './icons/LocationPin';

type LocationCardProps = {
    summary?: boolean;
    locationId: string;
};

const LocationCard: Component<LocationCardProps> = (props) => {
    const location = createMemo<Location | null>(() => {
        return story.locations.find(loc => loc.id === props.locationId) ?? null;
    });

    return (
        <Show
            when={location() !== null}
            fallback={<div class="loading">Loading location...</div>}
        >
            <Card
                link={props.summary ? `/location/${location()!.id}` : undefined}
                label={`View details for ${location()!.name}`}
                summary={!!props.summary}
                class="location-card"
                title={<>
                    <LocationPinIcon /> {location()!.name}
                </>}
            >
                <Show when={location()!.description}>
                    <p class="description">{location()!.description}</p>
                </Show>

                <Show when={location()!.geofence}>
                    <Map geofence={location()!.geofence!} summary={props.summary} />
                </Show>

                <Show when={location()!.tags?.length}>
                    <div class="tags">
                        <For each={location()!.tags}>
                            {(tag) => <span class="tag">{tag}</span>}
                        </For>
                    </div>
                </Show>
            </Card>
        </Show>
    );
};

export default LocationCard;
