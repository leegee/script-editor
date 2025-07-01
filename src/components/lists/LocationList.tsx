import { For, Show, createMemo } from 'solid-js';
import LocationCard from '../cards/LocationCard';
import { storyApi } from '../../lib/story';
import LocationCreator from '../creators/LocationCreator';

export default () => {
    const locations = createMemo(() => storyApi.getLocations());

    return (
        <section>
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
        </section>
    );
};
