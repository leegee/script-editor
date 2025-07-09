import './SceneList.scss';
import { type Component, createResource, For, Show } from 'solid-js';
import { storyApi } from '../../stores/story';
import SceneCard from '../cards/SceneCard';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const [scenes] = createResource(
        () => props.actId,
        async (actId) => await storyApi.getScenesByActId(actId)
    );

    return (
        <section class="scene-list" role="list" aria-label="Scenes List">
            <Show when={scenes()} fallback={<div>Loading scenes...</div>}>
                <For each={scenes()}>
                    {(scene) => <>
                        <SceneCard sceneId={scene.id} summary={true} />
                    </>}
                </For>
            </Show>
        </section>
    );
};

export default SceneList;
