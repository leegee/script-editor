import { storyApi } from "../../stores/story"

interface RemoveCharacterButtonProps {
    sceneId: string;
    characterId: string;
}

export default (props: RemoveCharacterButtonProps) => {
    const removeCharacter = () => {
        if (confirm('This will remove the character and all associated script lines.')) {
            storyApi.removeCharacterFromScene(props.sceneId, props.characterId);
        }
    };
    return (
        <button class='remove' onclick={removeCharacter}>Remove</button>
    )
}
