import { type Component, For, createMemo } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/LocationCard';
import { storyApi } from '../lib/story';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();

    // Always build a list: either one or all
    const locations = createMemo(() => {
        if (params.id) {
            const loc = storyApi.getLocation(params.id);
            return loc ? [loc] : [];
        }
        return storyApi.getLocations();
    });

    return (
        <section class="location-details">
            <h2>Locations</h2>
            <section class="locations-list" role="list" aria-label="Locations">
                <For each={locations()}>
                    {(loc) => (
                        <LocationCard locationId={loc.id} summary={true} />
                    )}
                </For>
            </section>
        </section>
    );
};

export default LocationDetails;
