import { storyApi } from "../../stores/story"

interface RemoveLocationButtonProps {
    sceneId: string;
    characterId: string;
}

export default (props: RemoveLocationButtonProps) => {
    const removeLocation = () => {
        if (confirm('This will remove the character and all their script lines.')) {
            storyApi.removeCharacterFromScriptLinesInScene(props.sceneId, props.characterId);
            storyApi.unlinkEntityFromScene(props.sceneId, props.characterId, 'characterIds');
        }
    };
    return (
        <button class='remove' onclick={removeLocation}>Remove</button>
    )
}
