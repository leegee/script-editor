import { story, setStory } from './stores/story';
import { ButtonSelectList } from './ButtonSelectList';

type AddLocationProps = {
    sceneId: string;
};

export default function AddLocation(props: AddLocationProps) {
    // In Solid, the store 'story' is probably a reactive object, 
    // so access values directly (no useState/useEffect)

    const availableLocations = () =>
        Object.entries(story.locations).filter(
            ([id]) => story.scenes[props.sceneId].locationId !== id
        );

    const linkLocationScene = (sceneId: string, locationId: string) => {
        const scene = story.scenes[sceneId];
        if (!scene) {
            console.warn(`linkLocationScene: Scene ${sceneId} not found`);
            return;
        }

        setStory('scenes', sceneId, 'locationId', locationId);

        console.info(`Linked location ${locationId} to scene ${sceneId}`);
    };

    const handleAdd = ([id]: [string, any]) => {
        linkLocationScene(props.sceneId, id);
    };

    return (
        <ButtonSelectList
            options={availableLocations()}
            getLabel={([, location]) => location.name}
            onSelect={handleAdd}
            buttonLabel="➕ Add Location"
        />
    );
}
