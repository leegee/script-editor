import './SceneCard.scss';
import { type Component, Show, createMemo } from 'solid-js';
import { story } from '../../stores/story';
import CharacterList from '../lists/CharacterList';
import LocationCard from './LocationCard';
import BeatList from '../lists/BeatList';
import Card from './Card';
import { bindField } from '../../lib/bind-field';
import TextInput from '../TextInput';
import { uiOptions } from '../../stores/ui';
import BeatCreator from '../creators/BeatCreator';
import DeleteSceneButton from '../delete-buttons/DeleteSceneButton';
import AddCharacter from '../../AddCharacter';
import AddLocation from '../../AddLocation';

export interface SceneCardProps {
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
                        title={
                            <>
                                <span class='icon'>🎬 </span>
                                <TextInput {...bindField('scenes', scn.id, 'title')} />
                            </>
                        }
                        link={`/scene/${scn.id}`}
                        label={`View details for ${scn.title}`}
                        summary={props.summary}
                        class="scene-card"
                        menuItems={
                            <>
                                <BeatCreator sceneId={scn.id} >New Beat</BeatCreator>
                                <DeleteSceneButton sceneId={scn.id} />
                            </>
                        }

                    >
                        <section class="scene-details">

                            {/* <Show when={sc.durationSeconds !== undefined}>
                            <p class="scene-duration">
                                {Math.floor(sc.durationSeconds / 60)}m {sc.durationSeconds % 60}s
                            </p>
                        </Show> */}

                            <Show when={uiOptions.showActMetaData}>
                                <div class="scene-summary">
                                    <TextInput as='textarea' placeholder='Scene summary' {...bindField('scenes', scn.id, 'summary')} />
                                </div>

                                <h4>
                                    Scene Locations
                                    <AddLocation sceneId={scn.id} />
                                </h4>
                                <LocationCard sceneId={scn.id} locationId={scn.locationId} summary={true} />

                                <h4>
                                    Scene Characters <AddCharacter sceneId={scn.id} />
                                </h4>

                                <div class="scene-characters">
                                    <CharacterList characterIds={scn.characterIds} sceneId={scn.id} />
                                </div>

                                <h4>Scene Beats</h4>
                            </Show>

                            <BeatList sceneId={scn.id} />

                        </section>
                    </Card>
                );
            }}
        </Show >
    );
};

export default SceneCard;
