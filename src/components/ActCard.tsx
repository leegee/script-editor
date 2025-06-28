import './ActCard.scss';

import { type Component, createEffect, createSignal, For, Show } from 'solid-js';
import type { Act } from '../lib/types';
import SceneList from './SceneList';
import { fakeApi } from '../lib/fakeApi';
import { createAsync } from '@solidjs/router';
import CardHeader from './card/CardHeader';

interface ActCardProps {
    act: Act;
    summary: boolean;
}

const ActCard: Component<ActCardProps> = (props) => {
    const scenes = createAsync(() => fakeApi.getScenesByActId(props.act.id));
    const [isOpen, setIsOpen] = createSignal(false);
    const toggleOpen = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen());
    }

    return (
        <article
            class={"card act-card " + props.summary ? 'summary' : ''}
            tabIndex={0}
            role="listitem"
            aria-label={`Act ${props.act.number ?? ''}: ${props.act.title}`}
        >
            <CardHeader
                title={props.act.number + ': ' + props.act.title}
                link={props.summary ? `/act/${props.act.id}` : undefined}
                label={`View details for Act ${props.act.number}`}
                toggleOpen={props.summary ? toggleOpen : () => void 0}
                class="details-link"
            />

            <Show when={isOpen()}>
                <Show when={props.act.summary}>
                    <p class="summary">{props.act.summary}</p>
                </Show>

                <Show when={props.act.scenes?.length}>
                    <SceneList scenes={scenes()} />
                </Show>

                {/* <Show when={act.totalDurationSeconds}>
                <p>
                    <strong>Total Duration:</strong> {Math.round(act.totalDurationSeconds!)}s
                </p>
            </Show> */}
            </Show>
        </article >
    );
};

export default ActCard;
