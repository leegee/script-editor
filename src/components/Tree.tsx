// src/components/Tree.tsx
import { For, createSignal } from "solid-js";
import { Scene, ScriptLine } from "~/lib/types";

export interface TreeNode {
    id: string;
    label: string;
    type: 'story' | 'act' | 'scene' | 'beat' | 'line';
    children?: TreeNode[];
    ref?: Scene | ScriptLine;
}


interface TreeProps {
    nodes: TreeNode[];
}

export function Tree({ nodes }: TreeProps) {
    return (
        <ul role="tree" style={{ "list-style": "none", padding: 0 }}>
            <For each={nodes}>
                {(node) => <TreeNodeView node={node} />}
            </For>
        </ul>
    );
}

function TreeNodeView({ node }: { node: TreeNode }) {
    const [open, setOpen] = createSignal(false);
    const hasChildren = !!node.children?.length;

    return (
        <li role="treeitem" aria-expanded={hasChildren ? open() : undefined} style={{ padding: "4px 8px" }}>
            <div style={{ display: "flex", "align-items": "center", cursor: hasChildren ? "pointer" : "default" }}
                onClick={() => hasChildren && setOpen(!open())}>
                {hasChildren && (
                    <span style="width:16px;">{open() ? "▼" : "▶"}</span>
                )}
                <span style={{ "margin-left": hasChildren ? "4px" : "20px" }}>{node.label}</span>
            </div>
            {hasChildren && open() && (
                <Tree nodes={node.children!} />
            )}
        </li>
    );
}
