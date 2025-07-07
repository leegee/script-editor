import { For, Show, createMemo } from 'solid-js';
import LocationCard from '../cards/LocationCard';
import { storyApi } from '../../stores/story';
import type { EntityMap } from '../../lib/types';

type LocationListProps = {
    entityType: keyof EntityMap;
    entityId: string;
} | {
    entityType?: undefined;
    entityId?: undefined;
};

export default (props: LocationListProps) => {
    const locations = createMemo(() => {
        if (props.entityType === 'acts') {
            return storyApi.getLocationForAct(props.entityId)
        }
        else if (props.entityType === 'scenes') {
            return [storyApi.getLocationForScene(props.entityId)]
        }
        else {
            return storyApi.getLocations();
        }
    });

    return (
        <section>
            <Show when={locations()} fallback={<div>No lcations found</div>}>
                <section class="location-list" role="list" aria-label="Locations List">
                    <For each={locations()}>
                        {(location) => (
                            <LocationCard location={location} summary={true} />
                        )}
                    </For>
                </section>
            </Show>
        </section>
    );
};
