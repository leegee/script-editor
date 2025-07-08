import './SceneList.scss';
import { type Component, createMemo, For } from 'solid-js';
import { storyApi } from '../../stores/story';
import SceneCard from '../cards/SceneCard';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const scenes = createMemo(() => storyApi.getScenesByActId(props.actId));

    return (
        <section class="scene-list" role="list" aria-label="Scenes List">
            <For each={scenes()}>
                {(scene) => <SceneCard sceneId={scene.id} summary={true} />}
            </For>
        </section>
    );
};

export default SceneList;
