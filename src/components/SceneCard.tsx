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
    const scene = createMemo(() => story.scenes[props.sceneId]);

    return (
        <Show when={scene()} fallback={<div class="loading">Loading scene...</div>}>
            {(sceneUpd) => {
                const scn = sceneUpd();
                return (
                    <Card
                        title={scn.title}
                        link={props.summary ? `/scene/${scn.id}` : undefined}
                        label={`View details for ${scn.title}`}
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
                            <Show when={scn.summary}>
                                <h3>Summary</h3>
                                <p class="scene-summary">{scn.summary}</p>
                            </Show>

                            <Show when={scn.characterIds?.length}>
                                <h3>Characters</h3>
                                <div class="scene-characters">
                                    <CharacterList characterIds={scn.characterIds} />
                                </div>
                            </Show>

                            <Show when={scn.locationId}>
                                <LocationCard locationId={scn.locationId} summary={true} />
                            </Show>

                            <Show when={scn.scriptExcerpt}>
                                <blockquote class="scene-script-excerpt">{scn.scriptExcerpt}</blockquote>
                            </Show>

                            <h3>Beats</h3>

                            <Show when={scn.beatIds?.length}>
                                <BeatList sceneId={scn.id} />
                            </Show>
                        </section>
                    </Card>
                );
            }}
        </Show>
    );
};

export default SceneCard;
