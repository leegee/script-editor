import './SceneList.scss';
import { type Component, createMemo, For, Show } from 'solid-js';
import { storyApi } from '../../lib/story';
import SceneCard from '../cards/SceneCard';
import SceneCreator from '../creators/SceneCreator';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const scenes = createMemo(() => storyApi.getScenesByActId(props.actId));

    return (
        <section class="scene-list" role="list" aria-label="Scenes List">
            <Show when={scenes} fallback={<p>Loading scenes...</p>}>
                <For each={scenes()}>
                    {(scene) => <SceneCard sceneId={scene.id} summary={true} />}
                </For>
            </Show>
            <SceneCreator />
        </section>
    );
};

export default SceneList;
