import { storyApi } from "../../stores/story"

interface DeleteActButtonProps {
    actId: string;
}

export default (props: DeleteActButtonProps) => {
    const deleteAct = () => {
        if (confirm('Delete this act?')) {
            storyApi.deleteEntity('acts', props.actId);
        }
    };
    return (
        <button class='delete' onclick={deleteAct}>Delete</button>
    )
}