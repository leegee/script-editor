import { type Component, For, createResource, createSignal } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/cards/LocationCard';
import { storyApi } from './story';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();
    const [locationId, setLocationId] = createSignal<string | null>(params.id ?? null);


    const fetchLocations = async (id: string | null) => {
        if (id) {
            const loc = await storyApi.getLocation(id);
            return loc ? [loc] : [];
        }
        return storyApi.getLocations();
    };

    const [locations] = createResource(locationId(), fetchLocations);

    return (
        <section class="location-details">
            {/* <h2>Locations!</h2> */}
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
