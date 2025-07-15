import './ImageThumbnail.scss';
import { Show, createSignal, createResource, createMemo } from 'solid-js';
import { storyApi } from '../stores/story';
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
    openModal?: boolean;
}

const ImageThumbnail = <
    EntityType extends keyof EntityMap,
    FieldType extends keyof EntityMap[EntityType]
>(
    props: ImageThumbnailProps<EntityType, FieldType>
) => {
    const [lightboxOpen, setLightboxOpen] = createSignal(!!props.openModal);
    const [version, setVersion] = createSignal(0);

    const handleUpload = async () => {
        setVersion(v => v + 1);
    };

    const [entity] = createResource(
        () => [props.entityType, props.entityId, version()] as const,
        async ([type, id]) => await storyApi.getEntity(type, id)
    );

    const src = createMemo(() => {
        const ent = entity();
        if (!ent) return '';
        const value = ent[props.field as keyof typeof ent];
        return typeof value === 'string' ? value : '';
    });

    const closeModal = () => {
        setLightboxOpen(false);
    };

    const handleDelete = async () => {
        await storyApi.updateEntityField(
            props.entityType,
            props.entityId,
            props.field,
            undefined
        );
        setVersion(v => v + 1);
        closeModal();
    };

    return (
        <Show
            when={src()}
            fallback={
                <section class="image-placeholder">
                    <span>No image</span>
                    <FileInput entity={props.entityType} id={props.entityId} field={props.field}
                        onUpload={handleUpload}
                    />
                </section>
            }
        >
            <section class="image-thumbnail">
                <div class="image-preview">
                    <img
                        src={src()}
                        alt={props.alt ?? (props.field as string)}
                        onClick={() => setLightboxOpen(true)}
                    />
                </div>

                <Modal title="Image" open={lightboxOpen()} onClose={closeModal}>
                    <img class="image-in-modal" src={src()} alt={props.alt ?? (props.field as string)} />
                    <div class="actions">
                        <FileInput entity={props.entityType} id={props.entityId} field={props.field}
                            onUpload={handleUpload}
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
