import { storyApi } from "../../stores/story";

export interface BeatCreatorProps {
    sceneId: string;
}

export default function (props: BeatCreatorProps) {
    return (
        <button class='new' onclick={
            () => storyApi.addNewBeatToScene(props.sceneId)
        }>Beat</button>
    );
}