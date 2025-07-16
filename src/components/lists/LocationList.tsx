import './LocationList.scss';
import { For, type JSX, Show, createResource, createSignal } from 'solid-js';
import type { Location, EntityMap } from '../../lib/types';
import { storyApi } from '../../stores/story';
import LocationCard from '../cards/LocationCard';
import LocationCreator from '../creators/LocationCreator';

type LocationListProps = {
    children?: JSX.Element
} & (
        | { entityType: keyof EntityMap; entityId: string; refresh?: number }
        | { entityType?: undefined; entityId?: undefined; refresh?: number }
    );

export default (props: LocationListProps) => {
    const [locations] =
        props.entityType === 'acts'
            ? storyApi.useLocationsForAct(props.entityId)
            : props.entityType === 'scenes'
                ? storyApi.useLocationForScene(props.entityId)
                : storyApi.useAllLocations();

    return (
        <section>
            <Show when={props.children && props.entityId}>
                <h4>
                    <span> {props.children || ''} </span>
                    <LocationCreator parentId={props.entityId ?? null} />
                </h4>
            </Show>

            <Show when={locations()} fallback={<div>No locations found</div>}>
                <section class="location-list" role="list" aria-label="Locations List">
                    <For each={locations()}>
                        {(location) => (
                            <LocationCard
                                location={location}
                                summary={true}
                                parentId={props.entityId ?? ''}
                            />
                        )}
                    </For>
                </section>
            </Show>
        </section>
    );
};