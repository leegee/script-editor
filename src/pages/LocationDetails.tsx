import { type Component, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/cards/LocationCard';
import { storyApi } from '../stores/story';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();

    const locationsSignal = params.id
        ? storyApi.useLocation(params.id)
        : storyApi.useAllLocations();

    const getLocations = locationsSignal[0];

    const locationsArray = () => {
        const val = getLocations();
        console.log('locationsArray value when params.id =', params.id, val);

        if (!val) return [];
        if (Array.isArray(val)) return val;
        return [val];
    };

    return (
        <section class="location-details">
            <section class="locations-list" role="list" aria-label="Locations">
                <Show when={getLocations()} fallback={<div>No locations</div>}>
                    <For each={locationsArray()}>
                        {(loc) => (
                            <LocationCard locationId={loc.id} summary={false} />
                        )}
                    </For>
                </Show>
            </section>
        </section>
    );
};

export default LocationDetails;
