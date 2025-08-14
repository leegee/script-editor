import { storyApi } from '../stores/story';
import { EntityMap } from './types';

let draggedData: { entityId: string; entityType: string, parentId: string, parentType: string, } | null = null;
let lastHighlightedElement: HTMLElement | null = null;

const resetState = () => {
    draggedData = null;
    if (lastHighlightedElement) {
        lastHighlightedElement.classList.remove('drag-over-valid');
        lastHighlightedElement = null;
    }
    console.log('[DragDrop] onDrop - Reset draggedData');
};

const validate = (condition: boolean, message: string) => {
    if (!condition) {
        console.warn(`[DragDrop] onDrop - ${message}`);
        return false;
    }
    return true;
};
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
        entityId: string,
    ) {
        if (!entityType || !event.dataTransfer) {
            console.warn('[DragDrop] onDragStart - Missing entityType or dataTransfer');
            return;
        }
        event.stopPropagation();
        const data = JSON.stringify({ entityId, entityType, parentType, parentId });
        event.dataTransfer.setData('text/plain', data);
        event.dataTransfer.effectAllowed = 'move';

        draggedData = { entityId, entityType, parentType, parentId };

        console.log(`[DragDrop] onDragStart - Drag started for entityId='${entityId}', entityType='${entityType}', parentType='${parentType}', parentId='${parentId}'`);
    }

    static onDragOver(event: DragEvent, targetElement: HTMLElement) {
        event.preventDefault();

        let isValidTarget = false;

        if (draggedData && event.dataTransfer) {
            const { entityType: draggedType } = draggedData;
            const allowedParentType = this.hierarchy[draggedType]?.parentClass;

            if (allowedParentType) {
                const { entityType: targetEntityType } = this.getEntityInfoFromElement(targetElement);

                if (targetEntityType === allowedParentType) {
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
        }

        if (!isValidTarget) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'none';
            }
            if (lastHighlightedElement) {
                lastHighlightedElement.classList.remove('drag-over-valid');
                lastHighlightedElement = null;
            }
        }
    }

    static async onDrop(event: DragEvent, targetElement: HTMLElement, refresh?: () => void) {
        console.log('Enter onDrop')
        event.preventDefault();

        if (!validate(!!draggedData, 'No dragged data available')) return;

        const { entityType: parentEntityType, entityId: parentId } = this.getEntityInfoFromElement(targetElement);
        if (!validate(!!parentEntityType && !!parentId, 'Invalid drop target: missing entityType or entityId')) return;

        const allowedParentType = this.hierarchy[draggedData.entityType]?.parentClass;
        if (!validate(parentEntityType === allowedParentType,
            `Invalid drop target entityType='${parentEntityType}' for dragged entityType='${draggedData.entityType}'. Expected parent type='${allowedParentType}'`)) return;

        console.log(`[DragDrop] onDrop - Dropping entityId='${draggedData.entityId}' into parent '${parentEntityType}' with ID='${parentId}'`);

        try {
            const entityId = draggedData.entityId;
            const childIdsField = this.hierarchy[draggedData.entityType].childIdsField;

            // TODO Raise this function after adding childIdsField
            const fetchAndValidateEntity = async (type: string, id: string, context: 'New' | 'Old') => {
                const entity = await storyApi.getEntity(type as keyof EntityMap, id);
                if (!validate(!!entity, `${context} parent entity not found`)) return null;
                if (!validate(!!entity[childIdsField], `${context} parent entity missing childIdsField '${childIdsField}'`)) return null;
                return entity;
            };

            const newParent = await fetchAndValidateEntity(parentEntityType, parentId, 'New');
            if (!newParent) return;

            const { parentType: oldParentType, parentId: oldParentId } = draggedData;

            if (oldParentId !== parentId || oldParentType !== parentEntityType) {
                const oldParent = await fetchAndValidateEntity(oldParentType, oldParentId, 'Old');
                if (!oldParent) return;

                const oldIds = oldParent[childIdsField] as string[];
                const oldIndex = oldIds.indexOf(entityId);
                if (oldIndex !== -1) {
                    oldIds.splice(oldIndex, 1);
                    console.log(`[DragDrop] onDrop - Removed entityId='${entityId}' from old parent '${oldParentType}' ID='${oldParentId}' at index ${oldIndex}`);
                    await storyApi.updateEntityField(oldParentType as keyof EntityMap, oldParentId, childIdsField, oldIds);
                    console.log('[DragDrop] onDrop - Old parent updated');
                } else {
                    console.log('[DragDrop] onDrop - Dragged entityId not found in old parent');
                }
            }

            const newIds = [...(newParent[childIdsField] as string[])];
            const existingIndex = newIds.indexOf(entityId);
            if (existingIndex !== -1) {
                newIds.splice(existingIndex, 1);
                console.log(`[DragDrop] onDrop - Removed duplicate entityId from index ${existingIndex} in new parent (reordering)`);
            }
            newIds.push(entityId);
            console.log(`[DragDrop] onDrop - New children order: [${newIds.join(', ')}]`);

            await storyApi.updateEntityField(parentEntityType as keyof EntityMap, parentId, childIdsField, newIds);
            console.log('[DragDrop] onDrop - New parent updated successfully');

            if (refresh) {
                refresh();
                console.log('[DragDrop] onDrop - UI refresh triggered');
            }
        } catch (error) {
            console.error('[DragDrop] onDrop - Error updating entity:', error);
        } finally {
            resetState();
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
