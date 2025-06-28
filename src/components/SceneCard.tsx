import './SceneCard.scss';
import { type Component, Show, createMemo } from 'solid-js';
import { story } from '../lib/fakeApi';
import CharacterList from './CharacterList';
import LocationCard from './LocationCard';
import BeatList from './BeatList';
import Card from './Card';

interface SceneCardProps {
    sceneId: string;
    summary: boolean;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    // Get the scene synchronously from the store
    const scene = createMemo(() => story.scenes[props.sceneId]);

    return (
        <Show when={scene()} fallback={<div class="loading">Loading scene...</div>}>
            {(scAccessor) => {
                const sc = scAccessor(); // unwrap the scene here
                return (
                    <Card
                        title={sc.title}
                        link={props.summary ? `/scene/${sc.id}` : undefined}
                        label={`View details for ${sc.title}`}
                        summary={props.summary}
                        class="scene-card"
                    >
                        {/* Uncomment if you want to show duration */}
                        {/* <Show when={sc.durationSeconds !== undefined}>
                            <p class="scene-duration">
                                {Math.floor(sc.durationSeconds / 60)}m {sc.durationSeconds % 60}s
                            </p>
                        </Show> */}

                        <section class="scene-details">
                            <Show when={sc.summary}>
                                <h3>Summary</h3>
                                <p class="scene-summary">{sc.summary}</p>
                            </Show>

                            <Show when={sc.characterIds?.length}>
                                <h3>Characters</h3>
                                <div class="scene-characters">
                                    <CharacterList characterIds={sc.characterIds} />
                                </div>
                            </Show>

                            <Show when={sc.locationId}>
                                <LocationCard locationId={sc.locationId} summary={true} />
                            </Show>

                            <Show when={sc.scriptExcerpt}>
                                <blockquote class="scene-script-excerpt">{sc.scriptExcerpt}</blockquote>
                            </Show>

                            <h3>Beats</h3>

                            <Show when={sc.beatIds?.length}>
                                <BeatList sceneId={sc.id} />
                            </Show>
                        </section>
                    </Card>
                );
            }}
        </Show>
    );
};

export default SceneCard;
