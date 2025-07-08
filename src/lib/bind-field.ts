import { createMemo } from 'solid-js';
import { storyApi } from '../stores/story';
import type { EntityMap } from './types';

export function bindField<T extends keyof EntityMap>(
    entity: T,
    id: string,
    field: keyof EntityMap[T],
    useOnBlur = true,
) {
    const value = createMemo(() => {
        const entityObj = storyApi.story[entity][id] as EntityMap[T] | undefined;
        return entityObj?.[field] ?? '';
    });

    function handleUpdate(event: Event) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const newValue = target.value;
        storyApi.updateEntity(entity, id, field, newValue as EntityMap[T][keyof EntityMap[T]]);
    }

    const noop = (_event: Event) => { };
    const onInput = useOnBlur ? noop : handleUpdate;
    const onBlur = useOnBlur ? handleUpdate : noop;

    return {
        value,
        onInput,
        onBlur,
    };
}
