import './SceneCard.scss';
import { type Component, Show, For, createSignal } from 'solid-js';
import type { Scene } from '../lib/types';

interface SceneCardProps {
    scene: Scene;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    const { scene } = props;
    const [isOpen, setIsOpen] = createSignal(false);

    const toggleOpen = () => setIsOpen(!isOpen());

    return (
        <div
            class={`scene-card ${isOpen() ? 'open' : ''}`}
            onClick={toggleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
            aria-expanded={isOpen()}
        >
            <header class="scene-header">
                <h2 class="scene-title">{scene.title}</h2>
                <Show when={scene.durationSeconds !== undefined}>
                    <span class="scene-duration">
                        {Math.floor(scene.durationSeconds! / 60)}m {scene.durationSeconds! % 60}s
                    </span>
                </Show>
            </header>

            <Show when={isOpen()}>
                <section class="scene-details">
                    <Show when={scene.summary}>
                        <p class="scene-summary">{scene.summary}</p>
                    </Show>

                    <Show when={scene.characters?.length}>
                        <div class="scene-characters">
                            <strong>Characters:</strong>
                            <ul>
                                <For each={scene.characters}>
                                    {(charId) => <li>{charId}</li>}
                                </For>
                            </ul>
                        </div>
                    </Show>

                    <Show when={scene.locationId}>
                        <p class="scene-location"><strong>Location:</strong> {scene.locationId}</p>
                    </Show>

                    <Show when={scene.scriptExcerpt}>
                        <blockquote class="scene-script-excerpt">{scene.scriptExcerpt}</blockquote>
                    </Show>
                </section>
            </Show>
        </div>
    );
};

export default SceneCard;
