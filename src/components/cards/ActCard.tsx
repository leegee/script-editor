import './ActCard.scss';

import { type Component, Show } from 'solid-js';
import { storyApi } from '../../stores/story';
import { uiOptions } from '../../stores/ui';
import SceneList from '../lists/SceneList';
import Card from './Card';
import TextInput from '../TextInput';
import { bindField } from '../../lib/bind-field';
import SceneCreator from '../creators/SceneCreator';
import DeleteActButton from '../delete-buttons/DeleteActButton';
import ActCreator from '../creators/ActCreator';
import LocationList from '../lists/LocationList';

interface ActCardProps {
    actId: string;
    summary?: boolean;
}

const ActCard: Component<ActCardProps> = (props) => {
    const { actId, summary } = props;

    const act = storyApi.getAct(actId);

    return (
        <Show when={act} fallback={<div class="loading">Loading act...</div>}>
            <Card
                entityType='acts'
                entityId={act.id}
                title={
                    <>
                        <span class='icon'>🎭</span>
                        <TextInput as='number' {...bindField('acts', act.id, 'number')} />
                        <TextInput {...bindField('acts', act.id, 'title')} />
                    </>
                }
                link={`/act/${act.id}`}
                label={`View details for Act ${act.number}`}
                summary={!!summary}
                class="act-card"
                menuItems={
                    <>
                        <ActCreator />
                        <SceneCreator actId={props.actId} />
                        <DeleteActButton actId={props.actId} />
                    </>
                }
            >
                <Show when={uiOptions.showActMetaData}>
                    <div class="act-summary">
                        <TextInput as='textarea' placeholder='Act summary' {...bindField('acts', act.id, 'summary')} />
                    </div>

                    <h4>All Locations in all scenes</h4>
                    <LocationList entityType='acts' entityId={act.id} />
                </Show>

                <hr />

                <SceneList actId={act.id} />

                {/*
                    <Show when={act.totalDurationSeconds}>
                    <p>
                        <strong>Total Duration:</strong> {Math.round(act.totalDurationSeconds!)}s
                    </p>
                    </Show>
                */}

            </Card>
        </Show>
    );
};

export default ActCard;
