import { storyApi } from "../../stores/story"

interface RemoveLocationButtonProps {
    sceneId: string;
    locationId: string;
}

export default (props: RemoveLocationButtonProps) => {
    const removeLocation = async () => {
        await storyApi.unlinkEntityFromParent('scenes', props.sceneId, props.locationId, 'locationId');
    };
    return (
        <button class='remove' onclick={removeLocation}>Remove</button>
    )
}
