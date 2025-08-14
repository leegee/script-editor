import { type Component, For, Show, createMemo, createResource } from "solid-js";
import { useSearchParams, type RouteSectionProps } from "@solidjs/router";
import { storyApi } from "../stores/story";
import ActCard from "../components/cards/ActCard";
import { DragDropHandler } from "../lib/DragDropHandler";

type ActDetailsOwnProps = {
    id?: string;
    summary?: boolean;
};

type ActDetailsProps = ActDetailsOwnProps & Partial<RouteSectionProps>;

const ActDetails: Component<ActDetailsProps> = (props) => {
    const [searchParams] = useSearchParams();

    const [parentId] = storyApi.useFirstStoryId();

    const idToUse = createMemo(() => props.id ?? props.params?.id);
    const summaryToUse = createMemo(() =>
        typeof props.summary === "boolean" ? props.summary : searchParams.summary === "true"
    );

    const [actsSingle] = storyApi.useAct(idToUse());
    const [actsAll] = storyApi.useActs();

    return (
        <section
            class="acts-list"
            role="list"
            aria-label="Acts"
            data-entity-type="stories"
            data-entity-id={'story-001'}
            onDragStart={(e: DragEvent) =>
                DragDropHandler.onDragStart(
                    e,
                    'stories',        // props.parentType ?? '',
                    'story-001',    // props.parentId,
                    'acts',         // props.entityType ?? '',
                    props.id,       // props.entityId
                )
            }
            onDragOver={(e: DragEvent) => DragDropHandler.onDragOver(e, e.currentTarget as HTMLElement)}
            onDrop={(e: DragEvent) => DragDropHandler.onDrop(e, e.currentTarget as HTMLElement)}
            onDragEnd={DragDropHandler.onDragEnd}
        >
            <Show when={idToUse()}>
                <Show when={actsSingle() && parentId()} fallback={<div>Cannot load act</div>}>
                    <ActCard
                        parentId={parentId()}
                        actId={actsSingle().id}
                        summary={summaryToUse()}
                    />
                </Show>
            </Show>

            <Show when={!idToUse()}>
                <Show when={parentId()}>
                    <For each={actsAll() ?? []}>
                        {(act) => (
                            <ActCard
                                parentId={parentId()}
                                act={act}
                                summary={summaryToUse()}
                            />
                        )}
                    </For>
                </Show>
            </Show>
        </section>
    );
};

export default ActDetails;
