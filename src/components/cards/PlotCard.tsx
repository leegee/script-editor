import './PlotCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Plot } from '../../lib/types';
import { storyApi } from '../../stores/story';
import Map from '../Map';
import Card from './Card';
import TextInput from '../TextInput';
import ImageThumbnail from '../ImageThumbnail';
import DeletePlotButton from '../delete-buttons/DeletePlotButton';
import RemovePlotButton from '../delete-buttons/RemovePlotButton';
import { useParams } from '@solidjs/router';
import { bindField } from '../../lib/bind-field';

type PlotCardProps = {
    plotId?: string;
    actId?: string;
    sceneId?: string;
    beatId?: string;
    plot?: Plot;
    summary?: boolean;
};

const PlotCard: Component<PlotCardProps> = (props) => {
    const params = useParams();
    const [fetchedPlot] = storyApi.usePlot(() => props.plotId ?? "");
    const plot = createMemo(() => props.plot ?? fetchedPlot());

    return (
        <Show when={plot()} keyed fallback={<h2 class='no-content'>Not found</h2>}>
            {(loc) => {
                const menuItems = [
                    <DeletePlotButton plotId={loc.id} />
                ];
                if (props.sceneId) {
                    menuItems.push(<RemovePlotButton
                        plotId={loc.id}
                        sceneId={props.sceneId}
                        actId={props.actId}
                        beatId={props.beatId}
                    />);
                }

                return (
                    <Card
                        draggable={false}
                        entityType='plots'
                        entityId={loc.id}
                        link={`/plot/${loc.id}`}
                        label={`View details for ${loc.name}`}
                        summary={!!props.summary}
                        class="plot-card"
                        title={
                            <span class='plot-heading'>
                                <TextInput {...bindField('plots', plot().id, 'name')} />

                            </span>
                        }
                        menuItems={menuItems}
                    >
                        <h5>Description</h5>
                        <div class='plot-desc-and-photo'>
                            <TextInput as='textarea' {...bindField('plots', plot().id, 'description')} />
                            <ImageThumbnail entityType='plots' entityId={loc.id} field='photoUrl' />
                        </div>

                    </Card>
                );
            }}
        </Show>
    );
};

export default PlotCard;
