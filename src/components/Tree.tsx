import './Tree.scss';
import { For, Show, createSignal } from 'solid-js';
import debounce from 'debounce';

import { storyApi } from '../stores/story';
import type {
    StoryNormalized,
    ActNormalized,
    SceneNormalized,
    BeatNormalized,
    ScriptLineNormalized,
    NormalizedStoryData,
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

type AnyNodeType = NormalizedStoryData[keyof NormalizedStoryData][string];

const [draggedNode, setDraggedNode] = createSignal<AnyNodeType | null>(null);
const [draggedType, setDraggedType] = createSignal<TreeNodeType | null>(null);

const [dragOverNode, setDragOverNode] = createSignal<AnyNodeType | null>(null);
const [dragOverType, setDragOverType] = createSignal<TreeNodeType | null>(null);

function canDropHere(dragType: TreeNodeType | null, dropType: TreeNodeType): boolean {
    if (!dragType) return false;
    if (dropType === 'story') return false;

    const allowedDrops: Record<TreeNodeType, TreeNodeType[]> = {
        story: ['act'],
        act: ['scene'],
        scene: ['beat'],
        beat: ['scriptline'],
        scriptline: []
    };
    return allowedDrops[dropType]?.includes(dragType) ?? false;
}


function handleDragStart(e: DragEvent, node: AnyNodeType, type: TreeNodeType) {
    console.log('dragStart target:', e.target, 'currentTarget:', e.currentTarget, 'node id:', node.id, 'type:', type);

    e.dataTransfer?.setData("application/json", JSON.stringify({ id: node.id, type }));
    e.dataTransfer!.effectAllowed = "move";

    setDraggedNode(node);
    setDraggedType(type);
    e.stopPropagation();
}

// Debounced handler receives plain data, no event object
const _handleDragOverDebounced = debounce(({ target, currentTarget, node, type }: {
    target: EventTarget | null,
    currentTarget: EventTarget | null,
    node: AnyNodeType,
    type: TreeNodeType
}) => {
    if (type === 'story') return;

    // Note: e.preventDefault and e.stopPropagation can't be called here because
    // event object is not available, so do that earlier in wrapper.

    console.log('dragOver target:', target, 'currentTarget:', currentTarget, 'node id:', node.id, 'type:', type);

    // We can't set dropEffect here either, so do that earlier if needed.

    setDragOverNode(node);
    setDragOverType(type);
}, 50);

// Wrapper that captures event data immediately and calls debounced function
function handleDragOver(e: DragEvent, node: AnyNodeType, type: TreeNodeType) {
    if (type === 'story') {
        e.preventDefault();
        e.stopPropagation();
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Set dropEffect here, where event is still fresh
    e.dataTransfer!.dropEffect = "move";

    // Capture relevant event info synchronously and pass to debounced
    _handleDragOverDebounced({
        target: e.target,
        currentTarget: e.currentTarget,
        node,
        type
    });
}

function handleDragLeave(e: DragEvent) {
    setDragOverNode(null);
    setDragOverType(null);
}

function handleDrop(e: DragEvent, node: AnyNodeType, type: TreeNodeType) {
    console.log('DROP TARGET:', e.target, 'currentTarget:', e.currentTarget, 'node id:', node.id, 'type:', type);
    e.preventDefault();
    e.stopPropagation();
    if (type === 'story') return;


    const droppedData = JSON.parse(e.dataTransfer?.getData("application/json")!);
    console.log(`Dropped ${droppedData.type}#${droppedData.id} on ${type}#${node.id}`);

    // TODO: Implement move logic here, e.g. storyApi.moveNode(droppedData, node);

    setDraggedNode(null);
    setDraggedType(null);
    setDragOverNode(null);
    setDragOverType(null);
}

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

    const classes = () => {
        const dragged = draggedNode();
        const draggedT = draggedType();
        const dragOver = dragOverNode();

        const isDragOverValid = dragOver && draggedT
            && canDropHere(draggedT, dragOverType())
            && dragOverType() !== 'story';

        return [
            "node",
            props.type,
            dragged && dragged.id === props.node.id ? "dragged" : "",
            dragOver && dragOver.id === props.node.id && isDragOverValid ? "drag-over" : "",
            dragged && canDropHere(draggedT, props.type) ? "valid-drop-zone" : ""
        ].filter(Boolean).join(" ");
    };

    const isDraggable = props.type !== 'story';

    const draggableProps = isDraggable
        ? {
            draggable: true,
            onDragStart: (e: DragEvent) => handleDragStart(e, props.node, props.type),
            onDrop: (e: DragEvent) => handleDrop(e, props.node, props.type),
            onDragOver: (e: DragEvent) => handleDragOver(e, props.node, props.type),
            onDragLeave: handleDragLeave,
        }
        : {
            draggable: false,
        };

    return (
        <li class={classes()} {...draggableProps}>
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
