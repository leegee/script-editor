import { createMemo } from 'solid-js';
import { story, setStory } from './story';

type EntityType = keyof typeof story; // 'acts' | 'scenes' | ...
type EntityItem<T extends EntityType> = T extends keyof typeof story
    ? typeof story[T][string]
    : never;

export function bindField<T extends EntityType>(
    entity: T,
    id: string,
    field: keyof EntityItem<T>,
    as: 'input' | 'textarea' = 'input',
    useOnBlur = false,
) {
    const value = createMemo(() => {
        const entityObj = story[entity][id] as EntityItem<T> | undefined;
        return entityObj?.[field] ?? '';
    });

    function handleUpdate(event: Event) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const newValue = target.value;

        // This cast is necessary because setStory expects exact keys
        setStory(entity, id as any, field as any, newValue);
    }

    return {
        value: value(),
        ...(useOnBlur ? { onBlur: handleUpdate } : { onInput: handleUpdate }),
        as,
    };
}
