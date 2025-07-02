import { storyApi } from "../../stores/story"

interface RemoveLocationButtonProps {
    sceneId: string;
    locationId: string;
}

export default (props: RemoveLocationButtonProps) => {
    const removeLocation = () => {
        storyApi.unlinkEntityFromScene(props.sceneId, props.locationId, 'locationId');
    };
    return (
        <button class='remove' onclick={removeLocation}>Remove</button>
    )
}
