import { type Component, For, createResource, createSignal } from 'solid-js';
import { storyApi } from '../../stores/story';
import SceneCard from '../cards/SceneCard';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const [scenes] = storyApi.useScenesByActId(() => props.actId);

    return (
        <div class="scenes">
            <For each={scenes()}>
                {(scene) => (
                    <SceneCard
                        scene={scene}
                        actId={props.actId}
                        summary={false}
                    />
                )}
            </For>
        </div>
    );
};

export default SceneList;