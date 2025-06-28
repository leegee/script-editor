import { For, Show } from 'solid-js';
import type { Location } from '../lib/types';
import LocationCard from './LocationCard';
import { fakeApi } from '../lib/fakeApi';
import { createAsync } from '@solidjs/router';

type LocationsListProps = {
    locations?: Location[];
};

export default (props: LocationsListProps) => {
    const locations = createAsync(() =>
        props.locations ? Promise.resolve(props.locations) : fakeApi.getLocations(undefined)
    );

    return (
        <section class="location-list" role="list" aria-label="Locations List">
            <Show when={locations()}>
                <For each={locations()}>
                    {(location) => (
                        <LocationCard location={location} summary={true} />
                    )}
                </For>
            </Show>
        </section>
    );
};
