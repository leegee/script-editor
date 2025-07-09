import { type Component, For, createResource } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/cards/LocationCard';
import { storyApi } from '../stores/story';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();

    const [locations] = createResource(async () => {
        if (params.id) {
            const loc = await storyApi.getLocation(params.id);
            return loc ? [loc] : [];
        }
        return storyApi.getLocations();
    });

    return (
        <section class="location-details">
            <section class="locations-list" role="list" aria-label="Locations">
                <For each={locations()}>
                    {(loc) => (
                        <LocationCard locationId={loc.id} summary={false} />
                    )}
                </For>
            </section>
        </section>
    );
};

export default LocationDetails;
