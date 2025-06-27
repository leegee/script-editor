import './ActCard.scss';

import { type Component, createEffect, createSignal, For, Show } from 'solid-js';
import type { Act } from '../lib/types';
import SceneList from './SceneList';
import { fakeApi } from '../lib/fakeApi';
import { createAsync } from '@solidjs/router';

interface ActCardProps {
    act: Act;
}

const ActCard: Component<ActCardProps> = (props) => {
    const scenes = createAsync(() => fakeApi.getScenesByActId(props.act.id));
    const [isOpen, setIsOpen] = createSignal(false);
    const toggleOpen = () => setIsOpen(!isOpen());

    const handleClick = () => {
        toggleOpen()
    };

    createEffect(() => {
        console.log(props.act, scenes())
    })

    return (
        <article
            class="act-card"
            tabIndex={0}
            role="listitem"
            aria-label={`Act ${props.act.number ?? ''}: ${props.act.title}`}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <h2>
                Act {props.act.number ?? ''}: {props.act.title}
            </h2>

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
