import './ActCard.scss';

import { type Component, Show } from 'solid-js';
import { storyApi } from '../../lib/story';
import SceneList from '../lists/SceneList';
import Card from '../Card';
import TextInput from '../Input';
import { bindField } from '../../lib/bind-field';

interface ActCardProps {
    actId: string;
    summary?: boolean;
}

const ActCard: Component<ActCardProps> = (props) => {
    const { actId, summary } = props;

    const act = storyApi.getAct(actId);
    const scenes = storyApi.getScenesByActId(actId);

    return (
        <Show when={act} fallback={<div class="loading">Loading act...</div>}>
            <Card
                title={<TextInput {...bindField('acts', act.id, 'title')} />}
                link={`/act/${act.id}`}
                label={`View details for Act ${act.number}`}
                summary={!!summary}
                class="act-card"
            >
                <p class="act-summary">
                    <TextInput {...bindField('acts', act.id, 'summary')} />
                </p>

                <Show when={scenes.length}>
                    <SceneList actId={act.id} />
                </Show>

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
