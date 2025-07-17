import { type Component, For, Show, createMemo, createResource } from "solid-js";
import { useSearchParams, type RouteSectionProps } from "@solidjs/router";
import { storyApi } from "../stores/story";
import ActCard from "../components/cards/ActCard";

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
        <section class="acts-list" role="list" aria-label="Acts">
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
