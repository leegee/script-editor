import { For, Show, createMemo } from 'solid-js';
import type { Location } from '../../lib/types';
import LocationCard from '../cards/LocationCard';
import { storyApi } from '../../lib/story';
import LocationCreator from '../creators/LocationCreator';

type LocationsListProps = {
    locations?: Location[];
};

export default (props: LocationsListProps) => {
    const locations = createMemo(() => props.locations ?? storyApi.getLocations());

    return (
        <Show when={locations()} fallback={<div>No lcations found</div>}>
            <section class="location-list" role="list" aria-label="Locations List">
                <For each={locations()}>
                    {(location) => (
                        <LocationCard location={location} summary={true} />
                    )}
                </For>
                <LocationCreator />
            </section>
        </Show>
    );
};
