import './LocationCard.scss';
import { type Component, Show, For, createSignal, createEffect } from 'solid-js';
import type { Location } from '../lib/types';
import { A } from '@solidjs/router';
import Find from './icons/Find';
import { fakeApi } from '../lib/fakeApi';
import Map from './Map';

interface LocationCardWithLocation {
    location: Location;
    locationId?: never;
}

interface LocationCardWithLocationId {
    location?: never;
    locationId: string;
}

type LocationCardProps = {
    "link-to-main"?: boolean;
} & (LocationCardWithLocation | LocationCardWithLocationId);

const LocationCard: Component<LocationCardProps> = (props) => {
    const [location, setLocation] = createSignal<Location | null>(props.location ?? null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [isOpen, setIsOpen] = createSignal(!props['link-to-main']);

    const toggleOpen = () => {
        if (props['link-to-main']) {
            setIsOpen(!isOpen());
        }
    }

    createEffect(() => {
        if (!props.location && props.locationId) {
            setLoading(true);
            setError(null);
            fakeApi.getLocation(props.locationId)
                .then(data => {
                    setLocation(data ?? null);
                    setError(data ? null : 'Location not found');
                })
                .catch(() => {
                    setError('Failed to load location');
                    setLocation(null);
                })
                .finally(() => setLoading(false));
        }
    });

    return (
        <div
            class={`location-card ${isOpen() ? 'open' : ''}`}
            aria-expanded={isOpen()}
        >
            <Show
                when={!loading()}
                fallback={<div class="loading">Loading location...</div>}
            >
                <Show
                    when={!error() && location()}
                    fallback={<div class="error">{error()}</div>}
                >
                    <div class="details">
                        <header
                            onClick={toggleOpen}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
                        >
                            <h3 class="name">
                                {location()?.name}
                                <Show when={props['link-to-main']}>
                                    <A href={`/location/${location()?.id}`} class="details-link" aria-label={`View details for ${location()?.name}`}>
                                        <Find />
                                    </A>
                                </Show>
                            </h3>
                        </header>

                        <Show when={isOpen()}>
                            <Show when={location()?.description}>
                                <p class="description">{location()?.description}</p>
                            </Show>

                            <Show when={location()?.tags?.length}>
                                <div class="tags">
                                    <For each={location()?.tags}>
                                        {(tag) => <span class="tag">#{tag}</span>}
                                    </For>
                                </div>
                            </Show>

                            <Show when={isOpen() && location()?.geofence}>
                                <Map geofence={location()!.geofence!} />
                            </Show>
                        </Show>
                    </div>
                </Show>
            </Show>
        </div>
    );
};

export default LocationCard;
