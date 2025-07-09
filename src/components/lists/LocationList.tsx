import { For, Show, createResource } from 'solid-js';
import type { Location, EntityMap } from '../../lib/types';
import { storyApi } from '../../stores/story';
import LocationCard from '../cards/LocationCard';

type LocationListProps =
    | { entityType: keyof EntityMap; entityId: string }
    | { entityType?: undefined; entityId?: undefined };

export default (props: LocationListProps) => {
    const [locations] = createResource(
        () => [props.entityType, props.entityId],
        async () => {
            if (props.entityType === 'acts') {
                return await storyApi.getLocationsForAct(props.entityId);
            } else if (props.entityType === 'scenes') {
                const loc = await storyApi.getLocationForScene(props.entityId);
                return loc ? [loc] : [];
            } else {
                return await storyApi.getLocations();
            }
        }
    );
    return (
        <section>
            <Show when={locations()} fallback={<div>No locations found</div>}>
                <section class="location-list" role="list" aria-label="Locations List">
                    <For each={locations()}>
                        {(location) => (
                            <LocationCard location={location as Location} summary={true} />
                        )}
                    </For>
                </section>
            </Show>
        </section>
    );
};
