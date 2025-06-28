import './SceneCard.scss';
import { type Component, Show } from 'solid-js';
import { createAsync } from '@solidjs/router';
import CharacterList from './CharacterList';
import LocationCard from './LocationCard';
import Card from './Card';
import { fakeApi } from '../lib/fakeApi';

interface SceneCardProps {
    sceneId: string;
    summary: boolean;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    const { sceneId, summary } = props;
    const scene = createAsync(() => fakeApi.getSceneById(sceneId));

    return (
        <Show when={scene()} fallback={<div class="loading">Loading scene...</div>}>
            <Card
                title={scene()!.title}
                link={summary ? `/scene/${scene()!.id}` : undefined}
                label={`View details for ${scene()!.title}`}
                summary={summary}
                class="scene-card"
            >
                <Show when={scene()!.durationSeconds !== undefined}>
                    <span class="scene-duration">
                        {Math.floor(scene()!.durationSeconds! / 60)}m {scene()!.durationSeconds! % 60}s
                    </span>
                </Show>

                <section class="scene-details">
                    <Show when={scene()!.summary}>
                        <p class="scene-summary">{scene()!.summary}</p>
                    </Show>

                    <Show when={scene()!.characterIds?.length}>
                        <div class="scene-characters">
                            <CharacterList characterIds={scene()!.characterIds} />
                        </div>
                    </Show>

                    <Show when={scene()!.locationId}>
                        <LocationCard locationId={scene()!.locationId} summary={true} />
                    </Show>

                    <Show when={scene()!.scriptExcerpt}>
                        <blockquote class="scene-script-excerpt">
                            {scene()!.scriptExcerpt}
                        </blockquote>
                    </Show>
                </section>
            </Card>
        </Show>
    );
};

export default SceneCard;
