import { Act, Beat, Scene, ScriptLine, Story } from "./types";

export function traverseStoryTree<T>(
    node: Story | Act | Scene | Beat | ScriptLine | undefined,
    visitor: (n: Story | Act | Scene | Beat | ScriptLine) => void
): void {
    if (!node) return;

    visitor(node);

    if ('acts' in node) {
        node.actIds.forEach(child => traverseStoryTree(child, visitor));
    } else if ('scenes' in node) {
        node.scenes.forEach(child => traverseStoryTree(child, visitor));
    } else if ('beats' in node) {
        node.beats.forEach(child => traverseStoryTree(child, visitor));
    } else if ('scriptlines' in node) {
        node.scriptlines.forEach(child => traverseStoryTree(child, visitor));
    } else if ('children' in node && Array.isArray(node.children)) {
        node.children.forEach(child => traverseStoryTree(child, visitor));
    }
}