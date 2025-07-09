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
    const idToUse = () => props.id ?? props.params?.id;
    const summaryToUse = () =>
        typeof props.summary === "boolean" ? props.summary : searchParams.summary === "true";

    if (idToUse()) {
        const [singleAct] = createResource(idToUse, storyApi.getAct);

        return (
            <section class="acts-list" role="list" aria-label="Act Detail">
                <Show when={singleAct()} fallback={<div>Loading act...</div>}>
                    {(act) => <ActCard actId={act().id} summary={summaryToUse()} />}
                </Show>
            </section>
        );
    } else {
        const [allActs] = createResource(() => storyApi.getActs());

        return (
            <section class="acts-list" role="list" aria-label="Acts List">
                <For each={allActs() ?? []}>
                    {(act) => <ActCard act={act} summary={summaryToUse()} />}
                </For>
            </section>
        );
    }
};

export default ActDetails;