import { type Component, For, createResource, createSignal } from 'solid-js';
import { storyApi } from '../../stores/story';
import SceneCard from '../cards/SceneCard';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const [refresh, setRefresh] = createSignal(0);

    const [scenes] = createResource(
        () => [props.actId, refresh()],
        async ([actId]) => await storyApi.getScenesByActId(String(actId))
    );

    const handleChange = () => {
        setRefresh(prev => prev + 1);
    };

    return (
        <div class="scenes">
            <For each={scenes()}>
                {(scene) => (
                    <SceneCard
                        scene={scene}
                        actId={props.actId}
                        onChange={handleChange}
                        summary={false}
                    />
                )}
            </For>
        </div>
    );
};

export default SceneList;