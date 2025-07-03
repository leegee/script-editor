import './Tree.scss';
import { For, Show } from 'solid-js';
import type {
    StoryNormalized,
    ActNormalized,
    SceneNormalized,
    BeatNormalized,
    ScriptLineNormalized,
} from '../lib/types';
import { storyApi } from '../stores/story';

function ScriptLineNode(props: { line: ScriptLineNormalized }) {
    return <li> {props.line.text}</li>;
}

function BeatNode(props: { beat: BeatNormalized }) {
    const scriptLines = () => storyApi.getScriptLinesByBeatId(props.beat.id);
    return (
        <li>
            <strong>Beat #{props.beat.number}</strong>
            <Show when={scriptLines().length > 0}>
                <ul>
                    <For each={scriptLines()}>
                        {(line) => <ScriptLineNode line={line} />}
                    </For>
                </ul>
            </Show>
        </li>
    );
}

function SceneNode(props: { scene: SceneNormalized }) {
    const beats = () => storyApi.getBeatsBySceneId(props.scene.id);
    return (
        <li>
            <strong>Scene #{props.scene.number}: {props.scene.title}</strong>
            <Show when={beats().length > 0}>
                <ul class='beats'>
                    <For each={beats()}>
                        {(beat) => <BeatNode beat={beat} />}
                    </For>
                </ul>
            </Show>
        </li>
    );
}

function ActNode(props: { act: ActNormalized }) {
    const scenes = () => storyApi.getScenesByActId(props.act.id);
    return (
        <li>
            <strong>Act #{props.act.number}: {props.act.title}</strong>
            <Show when={scenes().length > 0}>
                <ul class="scenes">
                    <For each={scenes()}>
                        {(scene) => <SceneNode scene={scene} />}
                    </For>
                </ul>
            </Show>
        </li>
    );
}

export default function StoryTree() {
    const story = () => storyApi.getStory();
    const acts = () => storyApi.getActs();

    return (
        <div>
            <h2>{story()?.title ?? 'Untitled Story'}</h2>
            <Show when={acts().length > 0} fallback={<p>No acts found</p>}>
                <ul class="acts">
                    <For each={acts()}>
                        {(act) => <ActNode act={act} />}
                    </For>
                </ul>
            </Show>
        </div>
    );
}
