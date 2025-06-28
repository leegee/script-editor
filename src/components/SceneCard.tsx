import './SceneCard.scss';
import { type Component, Show, For, createSignal } from 'solid-js';
import type { Scene } from '../lib/types';
import CharacterCard from './CharacterCard';
import LocationCard from './LocationCard';
import CharacterList from './CharacterList';
import CardHeader from './card/CardHeader';

interface SceneCardProps {
    scene: Scene;
    summary: boolean;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    const { scene } = props;
    const [isOpen, setIsOpen] = createSignal(false);

    const toggleOpen = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen());
    }

    return (
        <div
            class={`scene-card ${isOpen() ? 'open' : ''}`}
            aria-expanded={isOpen()}
            tabIndex={0}
        >

            <CardHeader
                title={scene.title}
                link={props[summary] ? `/location/${scene.id}` : undefined}
                label={`View details for ${scene.title}`}
                toggleOpen={props[summary] ? toggleOpen : () => void 0}
                class="scene-title"
            />

            {/* 
            <header class="scene-header"
                onClick={(e) => toggleOpen(e)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(e); }}
                role="button"
            >
                <h3 class="scene-title">{scene.title}</h3>
                <Show when={scene.durationSeconds !== undefined}>
                    <span class="scene-duration">
                        {Math.floor(scene.durationSeconds! / 60)}m {scene.durationSeconds! % 60}s
                    </span>
                </Show>
            </header> */}

            <Show when={isOpen()}>
                <Show when={scene.durationSeconds !== undefined}>
                    <span class="scene-duration">
                        {Math.floor(scene.durationSeconds! / 60)}m {scene.durationSeconds! % 60}s
                    </span>
                </Show>

                <section class="scene-details">
                    <Show when={scene.summary}>
                        <p class="scene-summary">{scene.summary}</p>
                    </Show>

                    <Show when={scene.characterIds?.length}>
                        <div class="scene-characters">
                            <CharacterList characterIds={scene.characterIds} />
                        </div>
                    </Show>

                    <Show when={scene.locationId}>
                        <LocationCard locationId={scene.locationId} summary={true} />
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
