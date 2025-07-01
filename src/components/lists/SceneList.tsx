import './SceneList.scss';
import { type Component, createMemo, For, Show } from 'solid-js';
import SceneCard from '../cards/SceneCard';
import { storyApi } from '../../lib/story';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const scenes = createMemo(() => storyApi.getScenesByActId(props.actId));

    return (
        <Show when={scenes} fallback={<p>Loading scenes...</p>}>
            <section class="scene-list" role="list" aria-label="Scenes List">
                <For each={scenes()}>
                    {(scene) => <SceneCard sceneId={scene.id} summary={true} />}
                </For>
            </section>
        </Show>
    );
};

export default SceneList;
