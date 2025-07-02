import { storyApi } from "../../stores/story"

interface UnlinkCharacterSceneButtonProps {
    sceneId: string;
    characterId: string;
}

export default (props: UnlinkCharacterSceneButtonProps) => {
    const unlinkCharacterScene = () => {
        if (confirm('Unink?')) {
            storyApi.unlinkCharacterScene(props.sceneId, props.characterId);
        }
    };
    return (
        <button class='delete' onclick={unlinkCharacterScene}>Unlink</button>
    )
}