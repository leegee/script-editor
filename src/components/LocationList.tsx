import { For, Show } from 'solid-js';
import type { Location } from '../lib/types';
import LocationCard from './LocationCard';
import { storyApi } from '../lib/story';

type LocationsListProps = {
    locations?: Location[];
};

export default (props: LocationsListProps) => {
    const locations = props.locations ? props.locations : storyApi.getLocations();

    return (
        <section class="location-list" role="list" aria-label="Locations List">
            <Show when={locations}>
                <For each={locations}>
                    {(location) => (
                        <LocationCard location={location} summary={true} />
                    )}
                </For>
            </Show>
        </section>
    );
};
