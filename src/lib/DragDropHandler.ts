import { storyApi } from '../stores/story';
import { EntityMap } from './types';

let draggedData: { cardId: string; entityType: string, parentId: string, parentType: string, } | null = null;
let lastHighlightedElement: HTMLElement | null = null;

export class DragDropHandler {
    static hierarchy = {
        'scriptlines': { parentClass: 'beats', childIdsField: 'scriptLineIds' },
        'beats': { parentClass: 'scenes', childIdsField: 'beatIds' },
        'scenes': { parentClass: 'acts', childIdsField: 'sceneIds' },
        'acts': { parentClass: 'stories', childIdsField: 'actIds' },
    };

    static getEntityInfoFromElement(element: HTMLElement): { entityType: string | null; entityId: string | null } {
        const entityType = element.dataset.entityType || null;
        const entityId = element.dataset.entityId || null;
        return { entityType, entityId };
    }

    static onDragStart(
        event: DragEvent,
        parentType: string,
        parentId: string,
        entityType: string,
        cardId: string,
    ) {
        if (!entityType || !event.dataTransfer) {
            console.warn('[DragDrop] onDragStart - Missing entityType or dataTransfer');
            return;
        }
        event.stopPropagation();
        const data = JSON.stringify({ cardId, entityType, parentType, parentId });
        event.dataTransfer.setData('text/plain', data);
        event.dataTransfer.effectAllowed = 'move';

        draggedData = { cardId, entityType, parentType, parentId };

        console.log(`[DragDrop] onDragStart - Drag started for cardId='${cardId}', entityType='${entityType}', parentType='${parentType}', parentId='${parentId}'`);
    }

    static onDragOver(event: DragEvent, targetElement: HTMLElement) {
        event.preventDefault();

        if (!draggedData || !event.dataTransfer) {
            event.dataTransfer.dropEffect = 'none';
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
                lastHighlightedElement = null;
            }
            return;
        }

        const { entityType: draggedType } = draggedData;
        const allowedParentType = this.hierarchy[draggedType]?.parentClass;
        if (!allowedParentType) {
            event.dataTransfer.dropEffect = 'none';
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
                lastHighlightedElement = null;
            }
            return;
        }

        const { entityType: targetEntityType } = this.getEntityInfoFromElement(targetElement);

        if (targetEntityType === allowedParentType) {
            event.dataTransfer.dropEffect = 'move';
            event.stopPropagation();

            if (lastHighlightedElement && lastHighlightedElement !== targetElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
            }
            if (!targetElement.classList.contains('drag-over-valid')) {
                targetElement.classList.add('drag-over-valid');
            }
            lastHighlightedElement = targetElement;
        } else {
            event.dataTransfer.dropEffect = 'none';
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
                lastHighlightedElement = null;
            }
        }
    }


    static async onDrop(event: DragEvent, targetElement: HTMLElement, refresh?: () => void) {
        event.preventDefault();

        if (!draggedData) {
            console.warn('[DragDrop] onDrop - No dragged data available');
            return;
        }

        const { entityType: parentEntityType, entityId: parentId } = this.getEntityInfoFromElement(targetElement);

        if (!parentEntityType || !parentId) {
            console.warn('[DragDrop] onDrop - Invalid drop target: missing entityType or entityId');
            return;
        }

        const allowedParentType = this.hierarchy[draggedData.entityType]?.parentClass;
        if (parentEntityType !== allowedParentType) {
            console.warn(`[DragDrop] onDrop - Invalid drop target entityType='${parentEntityType}' for dragged entityType='${draggedData.entityType}'. Expected parent type='${allowedParentType}'`);
            return;
        }

        console.log(`[DragDrop] ############# onDrop - Dropping cardId='${draggedData.cardId}' into parent '${parentEntityType}' with ID='${parentId}'`);

        try {
            const cardId = draggedData.cardId;
            const childIdsField = this.hierarchy[draggedData.entityType].childIdsField;

            // Get the new parent entity (the drop target)
            const newParent = await storyApi.getEntity(parentEntityType as keyof EntityMap, parentId);
            if (!newParent) {
                console.warn('[DragDrop] onDrop - New parent entity not found');
                return;
            }
            if (!newParent[childIdsField]) {
                console.warn(`[DragDrop] onDrop - New parent entity missing childIdsField '${childIdsField}'`);
                return;
            }

            const oldParentType = draggedData.parentType;
            const oldParentId = draggedData.parentId;

            // If the old parent is different from the new parent, remove card from old parent's children
            if (oldParentId !== parentId || oldParentType !== parentEntityType) {
                const oldParent = await storyApi.getEntity(oldParentType as keyof EntityMap, oldParentId);
                if (!oldParent) {
                    console.warn('[DragDrop] onDrop - Old parent entity not found');
                    return;
                }
                if (!oldParent[childIdsField]) {
                    console.warn(`[DragDrop] onDrop - Old parent entity missing childIdsField '${childIdsField}'`);
                    return;
                }

                const oldIds = oldParent[childIdsField] as string[];
                const oldIndex = oldIds.indexOf(cardId);
                if (oldIndex !== -1) {
                    oldIds.splice(oldIndex, 1);
                    console.log(`[DragDrop] onDrop - Removed dragged cardId='${cardId}' from old parent '${oldParentType}' ID='${oldParentId}' at position ${oldIndex}`);
                    await storyApi.updateEntityField(oldParentType as keyof EntityMap, oldParentId, childIdsField, oldIds);
                    console.log('[DragDrop] onDrop - Old parent entity updated successfully');
                } else {
                    console.log('[DragDrop] onDrop - Dragged cardId not found in old parent children');
                }
            }

            // Now update new parent children array
            const newIds = [...(newParent[childIdsField] as string[])];
            const sourceIndex = newIds.indexOf(cardId);
            if (sourceIndex !== -1) {
                newIds.splice(sourceIndex, 1);
                console.log(`[DragDrop] onDrop - Removed dragged cardId='${cardId}' from position ${sourceIndex} in new parent (possible reorder)`);
            }
            newIds.push(cardId);
            console.log(`[DragDrop] onDrop - New children IDs order after drop: [${newIds.join(', ')}]`);

            await storyApi.updateEntityField(parentEntityType as keyof EntityMap, parentId, childIdsField, newIds);
            console.log('[DragDrop] onDrop - New parent entity updated successfully');

            if (refresh) {
                refresh();
                console.log('[DragDrop] onDrop - UI refresh triggered');
            }
        } catch (error) {
            console.error('[DragDrop] onDrop - Error updating entity:', error);
        } finally {
            draggedData = null;
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
                lastHighlightedElement = null;
            }
            console.log('[DragDrop] onDrop - Reset draggedData');
        }
    }

    static onDragEnd(e) {
        // console.log('[ragDrop] onDragEnd - Drag operation ended, reset draggedData', draggedData, e);
        if (lastHighlightedElement) {
            lastHighlightedElement.classList.remove('drag-over-valid');
            lastHighlightedElement = null;
        }
        // draggedData = null;
    }
}
