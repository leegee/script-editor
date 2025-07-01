import './FileInput.scss';
import { Component, JSX } from 'solid-js';
import { storyApi } from '../lib/story';
import type { EntityMap } from '../lib/types';

interface FileInputProps<
    EntityType extends keyof EntityMap,
    K extends keyof EntityMap[EntityType]
> {
    entity: EntityType;
    id: string;
    field: K;
    accept?: string;
}

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });


/**
 * @example
 *  <FileInput
 *   entity="user"
 *   id="user123"
 *   field="profilePicture"
 * />
 * @param props 
 * @param props entity A normalised-story entity for `updateEntity`
 * @param props id The `id` of the entity for `updateEntity`
 * @param props field A field in the entity for `updateEntity`
 * @param props accept A MIME-type, defaults to `image/*`
 * @returns `JSX.Element`
 */
const FileInput = <
    EntityType extends keyof EntityMap,
    K extends keyof EntityMap[EntityType]
>(
    props: FileInputProps<EntityType, K>
): JSX.Element => {

    const onChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;

        try {
            const base64 = await fileToBase64(target.files[0]);
            storyApi.updateEntity(props.entity, props.id, props.field, base64 as EntityMap[EntityType][K]);
        } catch (error) {
            console.error('Failed to convert file(s) to base64', error);
        }
    };

    return (
        <span class='custom-file-input'>
            <input
                id="custom-file-input"
                class='custom-input'
                type="file"
                accept={props.accept ?? 'image/*'}
                multiple={false}
                onChange={onChange}
            />
            <label for="custom-file-input" class="custom-file-input-label">
                Choose file
            </label>
        </span>
    );
};

export default FileInput;
