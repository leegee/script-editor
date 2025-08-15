import { type Component, For, Show } from "solid-js";
import { storyApi } from "../../stores/story";
import ActCard from "../cards/ActCard";
import { DragDropHandler } from "../../lib/DragDropHandler";

export const AllActsList: Component = () => {
    const [parentId] = storyApi.useFirstStoryId();
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
                    'stories',
                    'story-001',
                    'acts',
                    undefined
                )
            }
            onDragOver={(e: DragEvent) => DragDropHandler.onDragOver(e, e.currentTarget as HTMLElement)}
            onDrop={(e: DragEvent) => DragDropHandler.onDrop(e, e.currentTarget as HTMLElement)}
            onDragEnd={DragDropHandler.onDragEnd}
        >
            <Show when={parentId()} fallback={<div>Cannot load acts</div>}>
                <For each={actsAll() ?? []}>
                    {(act) => (
                        <ActCard
                            parentId={parentId()}
                            act={act}
                            summary={true}
                        />
                    )}
                </For>
            </Show>
        </section>
    );
};

export default AllActsList;
