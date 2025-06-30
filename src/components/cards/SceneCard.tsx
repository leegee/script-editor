import './SceneCard.scss';
import { type Component, Show, createMemo } from 'solid-js';
import { story, storyApi } from '../../lib/story';
import CharacterList from '../lists/CharacterList';
import LocationCard from './LocationCard';
import BeatList from '../lists/BeatList';
import Card from '../Card';
import { bindField } from '../../lib/bind-field';
import TextInput from '../Input';

interface SceneCardProps {
    sceneId: string;
    summary: boolean;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    const scene = createMemo(() => story.scenes[props.sceneId]);

    const addNewBeat = () => {
        storyApi.createEntity(
            'beats',
            {
                title: 'New Beat',
                scriptLineIds: [],
            },
            {
                parentType: 'scenes',
                parentId: props.sceneId,
                parentListField: 'beatIds'
            }
        );
    };

    return (
        <Show when={scene()} fallback={<div class="loading">Loading scene...</div>}>
            {(sceneUpd) => {
                const scn = sceneUpd();
                return (
                    <Card
                        title={<TextInput {...bindField('scenes', scn.id, 'title')} />}
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
                            <h4>Summary</h4>
                            <p class="scene-summary">
                                <TextInput {...bindField('scenes', scn.id, 'summary')} />
                            </p>

                            <h4>Characters</h4>
                            <div class="scene-characters">
                                <CharacterList characterIds={scn.characterIds} />
                            </div>

                            <h4>Locations</h4>
                            <LocationCard locationId={scn.locationId} summary={true} />

                            <blockquote class="scene-script-excerpt">
                                <TextInput {...bindField('scenes', scn.id, 'scriptExcerpt')} />
                            </blockquote>

                            <h4>Beats</h4>
                            <BeatList sceneId={scn.id} />

                            <button class='new' onclick={addNewBeat}>New Beat</button>

                        </section>
                    </Card>
                );
            }}
        </Show>
    );
};

export default SceneCard;
