import { storyApi } from '../stores/story';

export const DragDropHandler = {
    hierarchy: {
        'script-line-card': { parentClass: 'script-lines', entityType: 'beats', field: 'scriptLineIds' },
        'beat-card': { parentClass: 'beats', entityType: 'scenes', field: 'beatIds' },
        'scene-card': { parentClass: 'scenes', entityType: 'acts', field: 'sceneIds' },
        'act-card': { parentClass: 'acts', entityType: 'stories', field: 'actIds' },
        'story-card': { parentClass: 'stories', entityType: 'root', field: 'storyIds' },
        'location-card': { parentClass: 'location-list', entityType: 'stories', field: 'locationIds' } // Updated to stories
    },

    onDragStart(event: DragEvent, cardId: string, cardClass: string) {
        if (!cardClass || !event.dataTransfer) return;
        event.dataTransfer.setData('text/plain', JSON.stringify({ cardId, cardClass }));
        event.dataTransfer.effectAllowed = 'move';
    },

    onDragOver(event: DragEvent, targetClass: string, cardClass: string) {
        event.preventDefault();
        if (!cardClass || !targetClass || !event.dataTransfer) {
            event.dataTransfer!.dropEffect = 'none';
            return;
        }
        const data = event.dataTransfer.getData('text/plain');
        if (!data) {
            event.dataTransfer!.dropEffect = 'none';
            return;
        }
        const { cardClass: draggedClass } = JSON.parse(data);
        const config = this.hierarchy[draggedClass as keyof typeof this.hierarchy];
        if (config && (targetClass.includes(config.parentClass) || targetClass.includes(draggedClass))) {
            event.dataTransfer!.dropEffect = 'move';
        } else {
            event.dataTransfer!.dropEffect = 'none';
        }
    },

    async onDrop(event: DragEvent, targetId: string | null, parentId: string, refresh?: () => void) {
        event.preventDefault();
        const data = event.dataTransfer?.getData('text/plain');
        if (!data || !parentId) return;
        const { cardId, cardClass } = JSON.parse(data);
        const config = this.hierarchy[cardClass as keyof typeof this.hierarchy];
        if (!config || config.entityType === 'root') return;

        try {
            const parent = await storyApi.getEntity(config.entityType, parentId);
            if (!parent || !parent[config.field]) return;

            const ids = parent[config.field] as string[];
            const sourceIndex = ids.indexOf(cardId);
            if (sourceIndex === -1) return;

            const newIds = [...ids];
            newIds.splice(sourceIndex, 1);
            if (!targetId) {
                newIds.push(cardId);
            } else {
                const targetIndex = ids.indexOf(targetId);
                if (targetIndex !== -1) {
                    newIds.splice(targetIndex, 0, cardId);
                } else {
                    newIds.push(cardId);
                }
            }

            await storyApi.updateEntityField(config.entityType, parentId, config.field, newIds);
            if (refresh) refresh();
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    }
};