import './FileInput.scss';
import { createMemo, JSX } from 'solid-js';
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

let globalIdCounter = 0;

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const FileInput = <
    EntityType extends keyof EntityMap,
    K extends keyof EntityMap[EntityType]
>(
    props: FileInputProps<EntityType, K>
): JSX.Element => {
    // Destructure props for stable closure in onChange
    const { entity, id, field, accept } = props;

    const uniqueId = createMemo(() => {
        globalIdCounter += 1;
        return `fileinput-${globalIdCounter}`;
    });

    const onChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;

        console.log('Props in onChange:', entity, id, field);

        try {
            const base64 = await fileToBase64(target.files[0]);
            storyApi.updateEntity(entity, id, field, base64 as EntityMap[EntityType][K]);
            ;
        } catch (error) {
            console.error('Failed to convert file(s) to base64', error);
        }
    };

    return (
        <span class='custom-file-input'>
            <input
                id={uniqueId()}
                class='custom-input'
                type="file"
                accept={accept ?? 'image/*'}
                multiple={false}
                onChange={onChange}
            />
            <label for={uniqueId()} class="custom-file-input-label">
                Choose file
            </label>
        </span>
    );
};

export default FileInput;
