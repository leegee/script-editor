import './ActCard.scss';

import { type Component, Show } from 'solid-js';
import { storyApi } from '../lib/story';
import SceneList from './SceneList';
import Card from './Card';

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
                title={`${act.number}: ${act.title}`}
                link={`/act/${act.id}`}
                label={`View details for Act ${act.number}`}
                summary={!!summary}
                class="act-card"
            >
                <Show when={act.summary}>
                    <p class="summary">{act.summary}</p>
                </Show>

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
