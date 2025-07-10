import { DragDropHandler } from './DragDropHandler';
import { JSX } from 'solid-js';

interface DragDropProps {
    cardId: string;
    cardClass: string;
    parentId: string;
    refresh: () => void;
}

export function withDragDrop({ cardId, cardClass, parentId, refresh }: DragDropProps): JSX.HTMLAttributes<HTMLDivElement> {
    return {
        draggable: true,
        onDragStart: (e) => DragDropHandler.onDragStart(e, cardId, cardClass),
        onDragOver: (e) => DragDropHandler.onDragOver(e, cardClass, cardClass),
        onDrop: (e) => DragDropHandler.onDrop(e, cardId, parentId, refresh)
    };
}