import { type Component, createEffect, createMemo, Show } from "solid-js";
import { useParams, useSearchParams } from "@solidjs/router";
import { storyApi } from "../stores/story";
import ActCard from "./cards/ActCard";
import { DragDropHandler } from "../lib/DragDropHandler";

const ActDetails: Component = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [parentId] = storyApi.useFirstStoryId();

    const summaryToUse = createMemo(() => searchParams.summary === "true");

    const [actsSingle] = storyApi.useAct(() => params.id);

    return (
        <section
            class="acts-list"
            role="list"
            aria-label="Acts"
            data-entity-type="stories"
            data-entity-id="story-001"
            onDragStart={(e) => DragDropHandler.onDragStart(e)}
            onDragOver={(e) => DragDropHandler.onDragOver(e, e.currentTarget)}
            onDrop={(e) => DragDropHandler.onDrop(e, e.currentTarget)}
            onDragEnd={DragDropHandler.onDragEnd}
        >
            <Show when={params.id}>
                <Show when={actsSingle() && parentId()} fallback={<div>Cannot load act</div>}>
                    <ActCard parentId={parentId()} act={actsSingle()} summary={summaryToUse()} />
                </Show>
            </Show>
        </section>
    );
};

export default ActDetails;
