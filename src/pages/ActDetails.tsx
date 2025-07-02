import { type Component, For, createMemo } from "solid-js";
import { useParams, useSearchParams, type RouteSectionProps } from "@solidjs/router";
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

    const summaryToUse = () => {
        if (typeof props.summary === "boolean") return props.summary;
        return searchParams.summary === "true";
    };

    const acts = createMemo(() => {
        const id = idToUse();
        if (id) {
            const act = storyApi.getAct(id);
            return act ? [act] : [];
        }
        return storyApi.getActs();
    });

    return (
        <section class="act-details">
            <section class="acts-list" role="list" aria-label="Acts List">
                <For each={acts()}>
                    {(act) => <ActCard actId={act.id} summary={summaryToUse() ?? false} />}
                </For>
            </section>
        </section>
    );
};

export default ActDetails;
