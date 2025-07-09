import { createSignal, createEffect } from "solid-js";
import { EntityMap } from "./types";
import { storyApi } from "../stores/story";

export function bindField<T extends keyof EntityMap>(
    entity: T,
    id: string,
    field: keyof EntityMap[T],
    useOnBlur = true
) {
    const [value, setValue] = createSignal<string>('');

    // When entity/id/field change, fetch initial value and set signal
    createEffect(async () => {
        if (!id) return;
        const entityObj = await storyApi.getEntity(entity, id);
        setValue((entityObj?.[field] ?? '') as string);
    });

    async function doTheUpdate(newValue: string) {
        if (newValue.trim() !== '') {
            await storyApi.updateEntityField(entity, id, field, newValue.trim() as EntityMap[T][keyof EntityMap[T]]);
        }
    }

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        setValue(target.value);
        if (!useOnBlur) {
            doTheUpdate(target.value);
        }
    };

    const handleBlur = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        setValue(target.value);
        if (useOnBlur) {
            doTheUpdate(value());
        }
    };

    return {
        value,
        onInput: handleInput,
        onBlur: handleBlur,
    };
}
