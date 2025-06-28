import './SceneList.scss';
import { type Component, For, Show } from 'solid-js';
import type { Scene } from '../lib/types';
import SceneCard from './SceneCard';

interface SceneListProps {
    scenes: Scene[];
}

const SceneList: Component<SceneListProps> = (props) => {
    return (
        <section class="scene-list" role="list" aria-label="Scenes List">
            <For each={props.scenes}>
                {(scene) => <SceneCard scene={scene} summary={true} />}
            </For>
        </section>
    );
};

export default SceneList;
