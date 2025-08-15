import { storyApi } from '../stores/story';
import { EntityMap } from './types';

let draggedData: { entityId: string; entityType: keyof EntityMap } | null = null;
let lastHighlightedElement: HTMLElement | null = null;

const resetState = () => {
    draggedData = null;
    if (lastHighlightedElement) {
        lastHighlightedElement.classList.remove('drag-over-valid');
        lastHighlightedElement = null;
    }
    console.log('[DragDrop] Reset draggedData');
};

const validate = (condition: boolean, message: string) => {
    if (!condition) {
        console.warn(`[DragDrop] ${message}`);
        return false;
    }
    return true;
};

// Use storyApi.getEntities to find parent
async function findParentEntity(entityType: keyof EntityMap, entityId: string) {
    console.log(`[DragDrop] Looking up parent for entityType='${entityType}', entityId='${entityId}'`);
    const hierarchy = DragDropHandler.hierarchy[entityType];
    if (!hierarchy) return null;

    const { parentClass, childIdsField } = hierarchy;
    if (!parentClass) return null;

    const parents = await storyApi.getEntities(parentClass);
    console.log(`[DragDrop] Checking ${parents.length} potential parents (${parentClass})`);

    for (const parent of parents) {
        if (Array.isArray(parent[childIdsField]) && (parent[childIdsField] as string[]).includes(entityId)) {
            console.log(`[DragDrop] Found parentId='${parent.id}' (${parentClass}) for ${entityType} ${entityId}`);
            return { parent, parentType: parentClass };
        }
    }
    console.warn(`[DragDrop] No parent found for ${entityType} ${entityId}`);
    return null;
}

export class DragDropHandler {
    static hierarchy: Record<keyof EntityMap, { parentClass: keyof EntityMap | null; childIdsField: keyof any | null }> = {
        scriptlines: { parentClass: 'beats', childIdsField: 'scriptLineIds' },
        beats: { parentClass: 'scenes', childIdsField: 'beatIds' },
        scenes: { parentClass: 'acts', childIdsField: 'sceneIds' },
        acts: { parentClass: 'stories', childIdsField: 'actIds' },
        characters: { parentClass: 'stories', childIdsField: 'characterIds' },
        locations: { parentClass: 'stories', childIdsField: 'locationIds' },
        plots: { parentClass: 'stories', childIdsField: 'plotIds' },
        stories: { parentClass: null, childIdsField: null }
    };

    static getEntityInfoFromElement(element: HTMLElement | null): { entityType: keyof EntityMap | null; entityId: string | null } {
        if (!element) return { entityType: null, entityId: null };
        const closest = element.closest<HTMLElement>('[data-entity-id][data-entity-type]');
        if (!closest) return { entityType: null, entityId: null };
        const entityType = closest.dataset.entityType as keyof EntityMap;
        const entityId = closest.dataset.entityId || null;
        return { entityType, entityId };
    }

    static onDragStart(event: DragEvent) {
        if (!event.dataTransfer) return;

        const { entityType, entityId } = this.getEntityInfoFromElement(event.target as HTMLElement);
        if (!validate(!!entityType && !!entityId, 'Missing entityType or entityId for drag')) return;

        event.stopPropagation();
        event.dataTransfer.setData('text/plain', JSON.stringify({ entityType, entityId }));
        event.dataTransfer.effectAllowed = 'move';

        draggedData = { entityType: entityType!, entityId: entityId! };
        console.log(`[DragDrop] onDragStart - Dragging ${entityType} ${entityId}`);
    }

    static async onDrop(event: DragEvent, targetElement: HTMLElement) {
        event.preventDefault();
        event.stopPropagation(); //  prevent bubbling to parent drop zones

        if (!draggedData) return;

        const { entityType: draggedType, entityId: draggedId } = draggedData;
        const { entityType: targetType, entityId: targetId } = this.getEntityInfoFromElement(targetElement);

        console.log(`[DragDrop] onDrop - dragged=${draggedType}:${draggedId}, target=${targetType}:${targetId}`);

        if (!validate(!!targetType && !!targetId, 'Invalid drop target')) return;

        // Same-type reorder
        if (draggedType === targetType) {
            const draggedParentInfo = await findParentEntity(draggedType, draggedId);
            const targetParentInfo = await findParentEntity(targetType, targetId);

            if (!draggedParentInfo || !targetParentInfo) return;

            // Same parent → reorder
            if (draggedParentInfo.parent.id === targetParentInfo.parent.id) {
                const listField = this.hierarchy[draggedType].childIdsField!;
                const parentList = [...(targetParentInfo.parent[listField] as string[])];

                const fromIndex = parentList.indexOf(draggedId);
                const toIndex = parentList.indexOf(targetId!);
                if (fromIndex === -1 || toIndex === -1) return;

                parentList.splice(fromIndex, 1);
                parentList.splice(toIndex, 0, draggedId);

                console.log(`[DragDrop] Reordering ${draggedType} within parent ${targetParentInfo.parent.id}`, parentList);
                await storyApi.updateEntity(targetParentInfo.parentType, {
                    ...targetParentInfo.parent,
                    [listField]: parentList
                });
                console.log('-'.repeat(30))
            } else {
                // Moving between different parents of same type (e.g. scene from act-1 to act-2)
                console.log(`[DragDrop] Moving ${draggedType} from ${draggedParentInfo.parent.id} to ${targetParentInfo.parent.id}`);
                // TODO: implement same-type move logic
            }
        } else {
            console.warn('[DragDrop] Moving to different type is not supported yet');
        }

        resetState();
    }


    static onDragOver(event: DragEvent, targetElement: HTMLElement) {
        event.preventDefault();
        let isValidTarget = false;

        if (draggedData && event.dataTransfer) {
            const { entityType: draggedType } = draggedData;
            const { entityType: targetEntityType } = this.getEntityInfoFromElement(targetElement);

            if (draggedType === targetEntityType) {
                event.dataTransfer.dropEffect = 'move';
                event.stopPropagation();
                isValidTarget = true;

                if (lastHighlightedElement && lastHighlightedElement !== targetElement) {
                    lastHighlightedElement.classList.remove('drag-over-valid');
                }
                if (!targetElement.classList.contains('drag-over-valid')) {
                    targetElement.classList.add('drag-over-valid');
                }
                lastHighlightedElement = targetElement;
            }
        }

        if (!isValidTarget) {
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
                lastHighlightedElement = null;
            }
        }
    }

    static onDragEnd() {
        if (lastHighlightedElement) {
            lastHighlightedElement.classList.remove('drag-over-valid');
            lastHighlightedElement = null;
        }
        resetState();
    }
}
