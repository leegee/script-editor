import './LocationCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Location } from '../../lib/types';
import { storyApi } from '../../stores/story';
import Map from '../Map';
import Card from './Card';
import LocationPinIcon from '../icons/LocationPin';
import TextInput from '../TextInput';
import ImageThumbnail from '../ImageThumbnail';
import DeleteLocationButton from '../delete-buttons/DeleteLocationButton';
import RemoveLocationButton from '../delete-buttons/RemoveLocationButton';
import { useParams } from '@solidjs/router';
import { bindField } from '../../lib/bind-field';

type LocationCardProps = {
    summary?: boolean;
    locationId?: string;
    location?: Location;
    sceneId?: string;
    parentId?: string;
    onChange?: () => void;
};

const LocationCard: Component<LocationCardProps> = (props) => {
    const params = useParams();
    const [fetchedLoc] = storyApi.useLocation(() => props.locationId ?? params.id ?? "");
    const location = createMemo(() => props.location ?? fetchedLoc());

    return (
        <Show when={location()} keyed fallback={<h2 class='no-content'>Not found</h2>}>
            {(loc) => {
                const menuItems = [
                    <DeleteLocationButton locationId={loc.id} />
                ];
                if (props.sceneId) {
                    menuItems.push(<RemoveLocationButton sceneId={props.sceneId} locationId={loc.id} />);
                }

                return (
                    <Card
                        draggable={false}
                        entityType='locations'
                        entityId={loc.id}
                        refresh={props.onChange}
                        link={`/location/${loc.id}`}
                        label={`View details for ${loc.name}`}
                        summary={!!props.summary}
                        class="location-card"
                        title={
                            <span class='location-heading'>
                                <LocationPinIcon />
                                <TextInput {...bindField('locations', location().id, 'name')} />

                            </span>
                        }
                        menuItems={menuItems}
                    >
                        <h5>Description</h5>
                        <div class='location-desc-and-photo'>
                            <TextInput as='textarea' {...bindField('locations', location().id, 'description')} />
                            <ImageThumbnail entityType='locations' entityId={loc.id} field='photoUrl' />
                        </div>

                        <Map locationId={loc.id} summary={props.summary} />

                        <Show when={loc.tags?.length}>
                            <div class="tags">
                                <For each={loc.tags}>
                                    {(tag) => <span class="tag">{tag}</span>}
                                </For>
                            </div>
                        </Show>
                    </Card>
                );
            }}
        </Show>
    );
};

export default LocationCard;
