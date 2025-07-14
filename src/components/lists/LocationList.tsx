import './LocationList.scss';
import { For, type JSX, Show, createResource, createSignal } from 'solid-js';
import type { Location, EntityMap } from '../../lib/types';
import { storyApi } from '../../stores/story';
import LocationCard from '../cards/LocationCard';
import LocationCreator from '../creators/LocationCreator';

type LocationListProps = {
    children: JSX.Element
} & (
        | { entityType: keyof EntityMap; entityId: string; refresh?: number }
        | { entityType?: undefined; entityId?: undefined; refresh?: number }
    );

export default (props: LocationListProps) => {
    const [refresh, setRefresh] = createSignal(props.refresh ?? 0);

    const [locations] = createResource(
        () => [props.entityType, props.entityId, refresh()],
        async () => {
            try {
                if (props.entityType === 'acts') {
                    return await storyApi.getLocationsForAct(props.entityId);
                } else if (props.entityType === 'scenes') {
                    const loc = await storyApi.getLocationForScene(props.entityId);
                    return loc ? [loc] : [];
                } else {
                    return await storyApi.getLocations();
                }
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                return [];
            }
        }
    );

    const handleChange = () => {
        setRefresh(prev => prev + 1);
    };

    return (
        <section>
            <h4>
                <span> {props.children || ''} </span>
                <LocationCreator parentId={props.entityId ?? null} refresh={handleChange}>
                    <button class='refresh'>Change Location</button>
                </LocationCreator>
            </h4>

            <Show when={locations()} fallback={<div>No locations found</div>}>
                <section class="location-list" role="list" aria-label="Locations List">
                    <For each={locations()}>
                        {(location) => (
                            <LocationCard
                                location={location as Location}
                                summary={true}
                                parentId={props.entityId ?? ''}
                                onChange={handleChange}
                            />
                        )}
                    </For>
                </section>
            </Show>
        </section>
    );
};