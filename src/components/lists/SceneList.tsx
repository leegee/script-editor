import './SceneList.scss';
import { type Component, createMemo, For, Show } from 'solid-js';
import { story } from '../../stores/story';
import SceneCard from '../cards/SceneCard';
import SceneCreator from '../creators/SceneCreator';

interface SceneListProps {
    actId: string;
}

const SceneList: Component<SceneListProps> = (props) => {
    const scenes = createMemo(() => {
        console.log('SceneList createMemo running for actId:', props.actId);
        const act = story.acts[props.actId];
        console.log('act:', act);
        if (!act) return [];
        const scenes = act.sceneIds.map(sceneId => story.scenes[sceneId]).filter(Boolean);
        console.log('scenes:', scenes);
        return scenes;
    });

    return (
        <section class="scene-list" role="list" aria-label="Scenes List">
            <For each={scenes()}>
                {(scene) => <SceneCard sceneId={scene.id} summary={true} />}
            </For>
            <SceneCreator actId={props.actId} />
        </section>
    );
};

export default SceneList;
