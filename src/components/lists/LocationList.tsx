import { For, Show, createMemo } from 'solid-js';
import type { Location } from '../../lib/types';
import LocationCard from '../cards/LocationCard';
import { storyApi } from '../../lib/story';

type LocationsListProps = {
    locations?: Location[];
};

export default (props: LocationsListProps) => {
    const locations = createMemo(() => props.locations ?? storyApi.getLocations());

    return (
        <section class="location-list" role="list" aria-label="Locations List">
            <Show when={locations()} fallback={<div>Loading locations...</div>}>
                <For each={locations()}>
                    {(location) => (
                        <LocationCard location={location} summary={true} />
                    )}
                </For>
            </Show>
        </section>
    );
};
