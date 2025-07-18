import './AddLocation.scss';
import { createResource, Show } from 'solid-js';
import OverflowMenu from './components/OverflowMenu';
import { storyApi } from './stores/story';

type AddLocationProps = {
    sceneId: string;
};

/**
 * Widget to add/replace scene locationId
 */
export default function AddLocation(props: AddLocationProps) {
    // Use a memo or signal if needed to subscribe/react to changes in StoryService internally
    const [availableLocations] = storyApi.useAllLocations();

    const handleAdd = async (locationId: string) => {
        await storyApi.replaceLocationInScene(props.sceneId, locationId);
    };

    return (
        <Show
            when={availableLocations()}
            fallback={<h2 class='no-content'>No locations found</h2>}
        >
            <OverflowMenu class="none" buttonContent={<small>↔ Set Location</small>}>
                <ul class="overflow-menu-list">
                    {availableLocations().map((location) => (
                        <li>
                            <button
                                type="button"
                                class="overflow-menu-item"
                                onClick={() => handleAdd(location.id)}
                            >
                                {location.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </OverflowMenu>
        </Show>
    );
}
