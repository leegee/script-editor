import './ActCard.scss';

import { type Component, Show } from 'solid-js';
import type { Act } from '../lib/types';
import SceneList from './SceneList';
import { fakeApi } from '../lib/fakeApi';
import { createAsync } from '@solidjs/router';
import Card from './Card';

interface ActCardProps {
    act: Act;
    summary: boolean;
}

const ActCard: Component<ActCardProps> = (props) => {
    const { act, summary } = props;
    const scenes = createAsync(() => fakeApi.getScenesByActId(act.id));

    return (
        <Card
            title={`${act.number}: ${act.title}`}
            link={summary ? `/act/${act.id}` : undefined}
            label={`View details for Act ${act.number}`}
            summary={summary}
            class="act-card"
        >
            <Show when={act.summary}>
                <p class="summary">{act.summary}</p>
            </Show>

            <Show when={scenes()?.length}>
                <SceneList scenes={scenes()!} />
            </Show>

            {/* 
      <Show when={act.totalDurationSeconds}>
        <p>
          <strong>Total Duration:</strong> {Math.round(act.totalDurationSeconds)}s
        </p>
      </Show> 
      */}
        </Card>
    );
};

export default ActCard;
