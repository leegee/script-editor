import { createMemo } from 'solid-js';
import { story, storyApi } from '../stores/story';
import type { EntityMap } from './types';
import { InputTypesEnum } from '../components/TextInput';

export function bindField<T extends keyof EntityMap>(
    entity: T,
    id: string,
    field: keyof EntityMap[T],
    as: InputTypesEnum = 'input', // 'input' | 'textarea' | 'color' | 'url' = 'input',
    useOnBlur = true,
) {
    const value = createMemo(() => {
        const entityObj = story[entity][id] as EntityMap[T] | undefined;
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
        as,
    };
}
