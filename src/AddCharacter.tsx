import { story, setStory } from './stores/story';
import { ButtonSelectList } from './ButtonSelectList';

type AddCharacterProps = {
    sceneId: string;
};

export default function (props: AddCharacterProps) {
    const availableCharacters = () =>
        Object.entries(story.characters).filter(
            ([id]) => !story.scenes[props.sceneId].characterIds?.includes(id)
        );

    const linkCharacterScene = (sceneId: string, characterId: string) => {
        const scene = story.scenes[sceneId];
        if (!scene) {
            console.warn(`linkCharacterScene: Scene ${sceneId} not found`);
            return;
        }

        // Prevent duplicates
        if (scene.characterIds?.includes(characterId)) {
            return;
        }

        setStory('scenes', sceneId, 'characterIds', (list = []) => [...list, characterId]);

        console.info(`Linked character ${characterId} to scene ${sceneId}`);
    };

    const handleAdd = ([id]: [string, any]) => {
        linkCharacterScene(props.sceneId, id);
    };

    return (
        <ButtonSelectList
            options={availableCharacters()}
            getLabel={([, character]) => character.name}
            onSelect={handleAdd}
            buttonLabel="➕ Add Character"
        />
    );
};
