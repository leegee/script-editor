import { type Component, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/cards/LocationCard';
import { storyApi } from '../stores/story';
import MapCollection from '../components/MapCollection';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();

    const locationsSignal = params.id
        ? storyApi.useLocation(() => params.id)
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
                <Show when={getLocations()} fallback={<h2 class='no-content'>No such location found</h2>}>

                    <Show when={locationsArray().length > 1}>
                        <h2>All Locations</h2>
                        <MapCollection locations={locationsArray()} />
                    </Show>

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
