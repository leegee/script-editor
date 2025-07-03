import { type CardProps } from "../components/cards/Card";
import { type EntityMap } from "./types";

export const handleDragStart = <T extends keyof EntityMap>(e: DragEvent, props: CardProps<T>) => {
    console.log('handleDragStart enter')
    e.dataTransfer?.setData('application/json', JSON.stringify({
        entityId: props.entityId,
        type: props.entityType,
    }));
    // xxx: set drag image, cursor, etc.
};

export const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    // Optionally add hover styling
};

export const handleDragEnd = (e: DragEvent) => {
    // xxxCleanup
};

export const handleDrop = <T extends keyof EntityMap>(e: DragEvent, props: CardProps<T>) => {
    e.preventDefault();

    const data = e.dataTransfer?.getData('application/json');
    if (!data) return;

    const dropped = JSON.parse(data) as {
        entityId: string;
        entityType: keyof EntityMap;
    };

    console.log(`Dropped ${dropped.entityType} ${dropped.entityId} onto ${props.entityType} ${props.entityId}`);

    // TODO: Validate the drop here!
};