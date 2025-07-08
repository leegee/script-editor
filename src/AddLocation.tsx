import './AddLocation.scss';
import { Show } from 'solid-js';
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
    const availableLocations = () => storyApi.getLocations();

    const handleAdd = (locationId: string) => {
        storyApi.replaceLocationInScene(props.sceneId, locationId);
    };

    return (
        <Show
            when={availableLocations().length}
            fallback={<small>No Locations Defined</small>}
        >
            <OverflowMenu class="none" buttonContent={<span>↔ Set Location</span>}>
                <ul class="overflow-menu-list">
                    {availableLocations().map(([id, location]) => (
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
