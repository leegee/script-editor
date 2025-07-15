import { type Component, For, Show, createMemo, createResource } from "solid-js";
import { useSearchParams, type RouteSectionProps } from "@solidjs/router";
import ActCard from "../components/cards/ActCard";
import { storyApi } from "../stores/story";

type ActDetailsOwnProps = {
    id?: string;
    summary?: boolean;
};

type ActDetailsProps = ActDetailsOwnProps & Partial<RouteSectionProps>;

const ActDetails: Component<ActDetailsProps> = (props) => {
    const [searchParams] = useSearchParams();
    const idToUse = createMemo(() => props.id ?? props.params?.id);
    const summaryToUse = createMemo(() =>
        typeof props.summary === "boolean" ? props.summary : searchParams.summary === "true"
    );

    if (idToUse()) {
        const [actResource] = storyApi.useAct(idToUse());

        return (
            <section class="acts-list" role="list" aria-label="Act Detail">
                <Show when={actResource()} fallback={<div>Loading act...</div>}>
                    {(act) => <ActCard actId={act().id} summary={summaryToUse()} />}
                </Show>
            </section>
        );
    } else {
        const [actsResource] = storyApi.useActs();

        return (
            <section class="acts-list" role="list" aria-label="Acts List">
                <For each={actsResource() ?? []}>
                    {(act) => <ActCard act={act} summary={summaryToUse()} />}
                </For>
            </section>
        );
    }
};

export default ActDetails;