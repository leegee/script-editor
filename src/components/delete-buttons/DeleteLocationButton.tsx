import { storyApi } from "../../stores/story"

interface DeleteLocationButtonProps {
    locationId: string;
}

export default (props: DeleteLocationButtonProps) => {
    const deleteLocation = () => {
        if (confirm('Delete this location?')) {
            storyApi.deleteEntity('locations', props.locationId);
        }
    };
    return (
        <button class='delete' onclick={deleteLocation}>Delete</button>
    )
}