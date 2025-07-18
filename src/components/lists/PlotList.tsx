import './PlotList.scss';
import { Component, createMemo, For, Show } from "solid-js";
import { storyApi } from "../../stores/story";
import PlotCard from "../cards/PlotCard";
import { Plot } from '../../lib/types';

type PlotListProps = {
    plot?: Plot;
    plotIds?: string[];
    sceneId?: string;
    actId?: string;
};

const PlotList: Component<PlotListProps> = (props) => {
    const actId = () => props.actId;
    const sceneId = () => props.sceneId;
    const plotIds = () => props.plotIds;

    const [allPlots] = storyApi.useAllPlots();
    const [plotsInAct] = storyApi.useAllPlotsInActById(actId);
    const [plotsInScene] = storyApi.useAllPlotsInScene(sceneId);

    const plots = createMemo(() => {
        if (props.plot) return [props.plot];
        if (actId()) return plotsInAct();
        if (sceneId()) return plotsInScene();
        if (plotIds()?.length) {
            return allPlots()?.filter(c => plotIds()?.includes(c.id));
        }
        return allPlots();
    });

    return (
        <section class="plot-list">
            <Show when={plots()?.length} fallback={<p>No plots</p>}>
                <For each={plots()}>
                    {(plot) => (
                        <PlotCard plotId={plot.id} summary />
                    )}
                </For>
            </Show>
        </section>
    );
};

export default PlotList;
