import './AddLocation.scss';
import { Show } from 'solid-js';
import OverflowMenu from './components/OverflowMenu';
import { story, setStory } from './stores/story';

type AddLocationProps = {
    sceneId: string;
};

/**
 * Widget to add/replace scene locationId
 */
export default function AddLocation(props: AddLocationProps) {
    const availableLocations = () =>
        Object.entries(story.locations).filter(([id]) => {
            const scene = story.scenes[props.sceneId];
            return scene.locationId !== id;
        });

    const replaceLocationInScene = (locationId: string) => {
        const scene = story.scenes[props.sceneId];
        if (!scene) {
            console.warn(`linkLocationScene: Scene ${props.sceneId} not found`);
            return;
        }

        setStory('scenes', props.sceneId, 'locationId', locationId);

        console.info(`Linked location ${locationId} to scene ${props.sceneId}`, story.scenes);
    };

    const handleAdd = (locationId: string) => {
        replaceLocationInScene(locationId);
    };

    return (
        <Show when={availableLocations().length} fallback={
            <small>No Locations Defined</small>}
        >
            <OverflowMenu class='none' buttonContent={<span>↔ Set Location</span>}>
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
