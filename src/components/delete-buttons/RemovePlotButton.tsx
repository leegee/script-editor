import { storyApi } from "../../stores/story"

interface RemoveLocationButtonProps {
    plotId: string;
    actId?: string;
    sceneId?: string;
    beatId?: string;
}

export default (props: RemoveLocationButtonProps) => {
    const removeLocation = async () => {
        if (props.actId) {
            await storyApi.unlinkEntityFromParent('acts', props.actId, props.actId, 'plotIds');
        }
        if (props.sceneId) {
            await storyApi.unlinkEntityFromParent('scenes', props.sceneId, props.plotId, 'plotIds');
        }
        if (props.beatId) {
            await storyApi.unlinkEntityFromParent('beats', props.beatId, props.plotId, 'plotIds');
        }
    };
    return (
        <button class='remove' onclick={removeLocation}>Remove</button>
    )
}
