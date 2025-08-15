import { type Component, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import PlotCard from '../components/cards/PlotCard';
import { storyApi } from '../stores/story';

const PlotDetails: Component = () => {
    const params = useParams<{ id: string }>();

    const plotsSignal = params.id
        ? storyApi.usePlot(() => params.id)
        : storyApi.useAllPlots();

    const getPlots = plotsSignal[0];

    const plotsArray = () => {
        const val = getPlots();
        console.log('plotsArray value when params.id =', params.id, val);

        if (!val) return [];
        if (Array.isArray(val)) return val;
        return [val];
    };

    return (
        <section class="plot-details">
            <section class="plots-list" role="list" aria-label="Plots">
                <Show when={getPlots()} fallback={<h2 class='no-cntent'>Not found</h2>}>
                    <For each={plotsArray()}>
                        {(p) => (
                            <PlotCard plotId={p.id} summary={false} />
                        )}
                    </For>
                </Show>
            </section>
        </section>
    );
};

export default PlotDetails;
