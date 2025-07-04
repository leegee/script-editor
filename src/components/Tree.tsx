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

const [hoveredDropZones, setHoveredDropZones] = createSignal<Record<string, number | null>>({});

const [dragOverIndex, setDragOverIndex] = createSignal<number | null>(null);

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
    e.dataTransfer?.setData("application/json", JSON.stringify({ id: node.id, type }));
    e.dataTransfer!.effectAllowed = "move";

    setDraggedNode(node);
    setDraggedType(type);
    e.stopPropagation();
}

// Debounced dragOver for nodes (not drop zones)
const _handleDragOverDebounced = debounce(({ target, currentTarget, node, type }: {
    target: EventTarget | null,
    currentTarget: EventTarget | null,
    node: AnyNodeType,
    type: TreeNodeType
}) => {
    if (type === 'story') return;

    setDragOverNode(node);
    setDragOverType(type);
    setDragOverIndex(null);
}, 50);

function handleDragOver(e: DragEvent, node: AnyNodeType, type: TreeNodeType) {
    if (type === 'story') {
        e.preventDefault();
        e.stopPropagation();
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer!.dropEffect = "move";

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
    setDragOverIndex(null);
}

function handleDropZoneDragOver(e: DragEvent, nodeId: string, index: number) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = "move";

    setHoveredDropZones((prev) => ({
        ...prev,
        [nodeId]: index,
    }));
}

function handleDropZoneDragLeave(e: DragEvent, nodeId: string) {
    e.preventDefault();
    e.stopPropagation();

    setHoveredDropZones((prev) => ({
        ...prev,
        [nodeId]: null,
    }));
}

function handleDropOnZoneDrop(
    e: DragEvent,
    parentNode: AnyNodeType,
    parentType: TreeNodeType,
    insertIndex: number
) {
    e.preventDefault();
    e.stopPropagation();

    const droppedData = JSON.parse(e.dataTransfer?.getData("application/json")!);
    console.log(`Dropped ${droppedData.type}#${droppedData.id} on ${parentType}#${parentNode.id} at index ${insertIndex}`);

    // TODO: Implement move logic here, e.g.
    // storyApi.moveNodeToIndex(droppedData, parentNode, insertIndex);

    setDraggedNode(null);
    setDraggedType(null);
    setDragOverNode(null);
    setDragOverType(null);
    setDragOverIndex(null);

    // Clear the hovered drop zone for this node:
    setHoveredDropZones(prev => ({
        ...prev,
        [parentNode.id]: null,
    }));
}

function handleDropOnNode(e: DragEvent, node: AnyNodeType, type: TreeNodeType) {
    e.preventDefault();
    e.stopPropagation();

    const droppedData = JSON.parse(e.dataTransfer?.getData("application/json")!);
    console.log(`Dropped ${droppedData.type}#${droppedData.id} on ${type}#${node.id}`);

    // TODO: Implement move logic here, e.g.
    // storyApi.moveNodeInside(droppedData, node);

    setDraggedNode(null);
    setDraggedType(null);
    setDragOverNode(null);
    setDragOverType(null);
    setDragOverIndex(null);
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
            onDrop: (e: DragEvent) => handleDropOnNode(e, props.node, props.type),
            onDragOver: (e: DragEvent) => handleDragOver(e, props.node, props.type),
            onDragLeave: handleDragLeave,
        }
        : {
            draggable: false,
        };

    const hoveredIndex = () => hoveredDropZones()[props.node.id] ?? null;

    return (
        <li class={classes()} {...draggableProps}>
            <span>{getLabel()}</span>
            <Show when={children.length > 0 && childType !== ''}>
                <ul>
                    <li
                        class={`drop-zone ${hoveredIndex() === 0 ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDropZoneDragOver(e, props.node.id, 0)}
                        onDragLeave={(e) => handleDropZoneDragLeave(e, props.node.id)}
                        onDrop={(e) => handleDropOnZoneDrop(e, props.node, props.type, 0)}
                    />
                    <For each={children}>
                        {(child, idx) => (
                            <>
                                <TreeNode node={child as any} type={childType as TreeNodeType} />
                                <li
                                    class={`drop-zone ${hoveredIndex() === idx() + 1 ? 'drag-over' : ''}`}
                                    onDragOver={(e) => handleDropZoneDragOver(e, props.node.id, idx() + 1)}
                                    onDragLeave={(e) => handleDropZoneDragLeave(e, props.node.id)}
                                    onDrop={(e) => handleDropOnZoneDrop(e, props.node, props.type, idx() + 1)}
                                />
                            </>
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
