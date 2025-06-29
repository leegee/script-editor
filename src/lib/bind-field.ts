import { createMemo } from 'solid-js';
import { story, setStory } from './story';
import type { NormalizedStoryData } from './types';  // adjust import path

type EntityMap = {
    [K in keyof NormalizedStoryData]: NormalizedStoryData[K] extends Record<string, infer Item> ? Item : never;
};

export function bindField<T extends keyof EntityMap>(
    entity: T,
    id: string,
    field: keyof EntityMap[T],
    as: 'input' | 'textarea' = 'input',
    useOnBlur = true,
) {
    const value = createMemo(() => {
        const entityObj = story[entity][id] as EntityMap[T] | undefined;
        console.log('value set', entity, id, 'is', entityObj?.[field])
        return entityObj?.[field] ?? '';
    });

    function handleUpdate(event: Event) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const newValue = target.value;
        console.log('set story', entity, id, field, newValue)
        setStory(entity as any, id as any, field as any, newValue);
    }

    const noop = (_event: Event) => { };
    const onInput = useOnBlur ? noop : handleUpdate;
    const onBlur = useOnBlur ? handleUpdate : noop;

    return {
        value,
        onInput,
        onBlur,
        as,
    };
}
