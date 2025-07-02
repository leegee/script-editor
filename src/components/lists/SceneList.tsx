import './SceneList.scss';
import { type Component, createMemo, For } from 'solid-js';
import { story } from '../../stores/story';
import SceneCard from '../cards/SceneCard';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const scenes = createMemo(() => {
        const act = story.acts[props.actId];
        if (!act) return [];
        const scenes = act.sceneIds.map(sceneId => story.scenes[sceneId]).filter(Boolean);
        return scenes;
    });

    return (
        <section class="scene-list" role="list" aria-label="Scenes List">
            <For each={scenes()}>
                {(scene) => <SceneCard sceneId={scene.id} summary={true} />}
            </For>
        </section>
    );
};

export default SceneList;
