import { storyApi } from "../../stores/story"

interface DeleteSceneButtonProps {
    sceneId: string;
}

export default (props: DeleteSceneButtonProps) => {
    const deleteScene = () => {
        if (confirm('Delete this scene?')) {
            storyApi.deleteEntity(
                'acts',
                props.sceneId,
                {
                    parentType: 'acts',
                    parentListField: 'sceneIds',
                }
            );
        }
    };
    return (
        <button class='delete' onclick={deleteScene}>Delete</button>
    )
}