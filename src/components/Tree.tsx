import './Tree.scss';
import { For, Show } from 'solid-js';
import { storyApi } from '../stores/story';
import type {
    StoryNormalized,
    ActNormalized,
    SceneNormalized,
    BeatNormalized,
    ScriptLineNormalized,
} from '../lib/types';

type TreeNodeProps =
    | { node: StoryNormalized; type: 'story' }
    | { node: ActNormalized; type: 'act' }
    | { node: SceneNormalized; type: 'scene' }
    | { node: BeatNormalized; type: 'beat' }
    | { node: ScriptLineNormalized; type: 'scriptline' };

type TreeNodeType = TreeNodeProps['type'];

type TreeNodeChildMap = {
    story: ActNormalized;
    act: SceneNormalized;
    scene: BeatNormalized;
    beat: ScriptLineNormalized;
};

export function TreeNode(props: TreeNodeProps) {
    const getLabel = () => {
        switch (props.type) {
            case 'story':
                return props.node.title ?? 'Untitled Story';
            case 'act':
                return `Act #${props.node.number}: ${props.node.title}`;
            case 'scene':
                return `Scene #${props.node.number}: ${props.node.title}`;
            case 'beat':
                return `Beat #${props.node.number}`;
            case 'scriptline':
                return props.node.text;
            default:
                return '';
        }
    };

    const getChildren = (): { children: any[]; childType: TreeNodeType | '' } => {
        switch (props.type) {
            case 'story':
                return { children: storyApi.getActs(), childType: 'act' };
            case 'act':
                return { children: storyApi.getScenesByActId(props.node.id), childType: 'scene' };
            case 'scene':
                return { children: storyApi.getBeatsBySceneId(props.node.id), childType: 'beat' };
            case 'beat':
                return { children: storyApi.getScriptLinesByBeatId(props.node.id), childType: 'scriptline' };
            default:
                return { children: [], childType: '' };
        }
    };

    const { children, childType } = getChildren();

    return (
        <li class={`node ${props.type}`}>
            <span>{getLabel()}</span>
            <Show when={children.length > 0 && childType !== ''}>
                <ul>
                    <For each={children}>
                        {(child) => (
                            <TreeNode
                                node={child as any}
                                type={childType as TreeNodeType}
                            />
                        )}
                    </For>
                </ul>
            </Show>
        </li>
    );
}

export default function StoryTree() {
    const story = () => storyApi.getStory();

    return (
        <div class="story-tree">
            <Show when={story()}>
                {(story) => (
                    <ul>
                        <TreeNode node={story()} type="story" />
                    </ul>
                )}
            </Show>
        </div>
    );
}
