import { type Component, createMemo, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/cards/LocationCard';
import { storyApi } from './story';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();
    const id = () => params.id ?? null;
    const [location] = storyApi.useLocation(() => id()!);
    const [allLocations] = storyApi.useAllLocations();

    const locations = createMemo(() => {
        if (id()) {
            const loc = location();
            return loc ? [loc] : [];
        }
        return allLocations() ?? [];
    });

    return (
        <section class="location-details">
            <section class="locations-list" role="list" aria-label="Locations">
                <For each={locations()}>
                    {(loc) => <LocationCard locationId={loc.id} summary={false} />}
                </For>
            </section>
        </section>
    );
};

export default LocationDetails;
