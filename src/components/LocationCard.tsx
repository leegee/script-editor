import './LocationCard.scss';
import { type Component, Show, For, createSignal, createEffect } from 'solid-js';
import type { Location } from '../lib/types';
import { fakeApi } from '../lib/fakeApi';
import Map from './Map';
import CardHeader from './card/CardHeader';

interface LocationCardWithLocation {
    location: Location;
    locationId?: never;
}

interface LocationCardWithLocationId {
    location?: never;
    locationId: string;
}

type LocationCardProps = {
    summary?: boolean;
} & (LocationCardWithLocation | LocationCardWithLocationId);

const LocationCard: Component<LocationCardProps> = (props) => {
    const [location, setLocation] = createSignal<Location | null>(props.location ?? null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [isOpen, setIsOpen] = createSignal(!props['summary']);

    const toggleOpen = () => {
        if (props['summary']) {
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
        <section
            class={`location-card ${isOpen() ? 'open' : ''} ${props.summary ? 'summary' : ''}`}
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
                        <CardHeader
                            title={location().name}
                            link={props.summary ? `/location/${location()?.id}` : undefined}
                            label={`View details for ${location().name}`}
                            toggleOpen={props.summary ? toggleOpen : () => void 0}
                            class="details-link"
                        />

                        <Show when={isOpen()}>
                            <Show when={location()?.description}>
                                <p class="description">{location()?.description}</p>
                            </Show>

                            <Show when={isOpen() && location()?.geofence}>
                                <Map geofence={location()!.geofence!} summary={props.summary} />
                            </Show>

                            <Show when={location()?.tags?.length}>
                                <div class="tags">
                                    <For each={location()?.tags}>
                                        {(tag) => <span class="tag">{tag}</span>}
                                    </For>
                                </div>
                            </Show>
                        </Show>
                    </div>
                </Show>
            </Show>
        </section >
    );
};

export default LocationCard;
