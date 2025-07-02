import { storyApi } from "../../stores/story"

interface DeleteBeatButtonProps {
    sceneId: string;
    beatId: string;
}

export default (props: DeleteBeatButtonProps) => {
    const deleteBeat = () => {
        if (confirm('Delete this beat?')) {
            storyApi.deleteEntity(
                'beats',
                props.beatId,
                {
                    parentType: 'scenes',
                    parentListField: 'beatIds',
                    parentId: props.sceneId
                }
            );
        }
    };
    return (
        <button class='delete' onclick={deleteBeat}>Delete</button>
    )
}