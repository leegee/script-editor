import { type JSX } from "solid-js";
import { storyApi } from "../../stores/story";

export interface BeatCreatorProps {
    sceneId: string;
    children?: JSX.Element | JSX.Element[]
}

export default function (props: BeatCreatorProps) {
    return (
        <button classList={{ 'new': !props.children }} onclick={
            () => storyApi.addNewBeatToScene(props.sceneId)
        }>{props.children || 'Beat'}</button>
    );
}