import './SceneCard.scss';
import { type Component, Show } from 'solid-js';
import type { Scene } from '../lib/types';
import CharacterList from './CharacterList';
import LocationCard from './LocationCard';
import Card from './Card';

interface SceneCardProps {
    scene: Scene;
    summary: boolean;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    const { scene, summary } = props;

    return (
        <Card
            title={scene.title}
            link={summary ? `/location/${scene.id}` : undefined}
            label={`View details for ${scene.title}`}
            summary={summary}
            class="scene-card"
        >
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
        </Card>
    );
};

export default SceneCard;
