import './ImageThumbnail.scss';
import { Show, createSignal, createMemo, createEffect } from 'solid-js';
import { storyApi } from '../lib/story';
import FileInput from './FileInput';
import { type EntityMap } from '../lib/types';
import Modal from './Modal';

interface ImageThumbnailProps<
    EntityType extends keyof EntityMap,
    FieldType extends keyof EntityMap[EntityType]
> {
    entityType: EntityType;
    entityId: string;
    field: FieldType;
    alt?: string;
}

const ImageThumbnail = <EntityType extends keyof EntityMap, FieldType extends keyof EntityMap[EntityType]>(
    props: ImageThumbnailProps<EntityType, FieldType>
) => {
    const [lightboxOpen, setLightboxOpen] = createSignal(false);

    const entity = createMemo(() => storyApi.getEntity(props.entityType, props.entityId));

    const src = createMemo(() => {
        const e = entity();
        if (!e) return '';
        const value = e[props.field];
        return typeof value === 'string' ? value : '';
    });

    const closeModal = () => {
        setLightboxOpen(false);
    }

    const handleDelete = () => {
        storyApi.updateEntity(
            props.entityType,
            props.entityId,
            props.field,
            undefined
        );
    };


    return (
        <Show
            when={src()?.trim()}
            fallback={
                <section class="image-placeholder">
                    <span>No image</span>
                    <FileInput
                        entity={props.entityType}
                        id={props.entityId}
                        field={props.field}
                    />
                </section>
            }
        >
            <section class="image-thumbnail">
                <div class='image-preview'>
                    <img src={src()} alt={props.alt ?? ''} onClick={() => setLightboxOpen(true)} />
                </div>

                <Modal title='Image' open={lightboxOpen()} onClose={closeModal}>
                    <img class='image-in-modal' src={src()} alt={props.alt ?? ''} />
                    <div class="actions">
                        <FileInput
                            entity={props.entityType}
                            id={props.entityId}
                            field={props.field}
                        />
                        <button onClick={handleDelete}>🗑️ Delete</button>
                        <button onClick={closeModal}>✖ Close</button>
                    </div>
                </Modal>
            </section>

        </Show>
    );
};

export default ImageThumbnail;
