import './SceneCard.scss';
import { type Component, Show, createEffect, createMemo, createResource } from 'solid-js';
import { storyApi } from '../../stores/story';
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
import { type Scene } from '../../lib/types';

export interface SceneCardProps {
    actId: string;
    scene?: Scene;
    sceneId?: string;
    summary: boolean;
}

const SceneCard: Component<SceneCardProps> = (props) => {
    const [sceneByIdFromDb] = storyApi.useScene(() => props.sceneId);

    const scene = createMemo(() => {
        if (props.scene) return props.scene;
        if (props.sceneId) return sceneByIdFromDb();
        throw new Error('Can not instantiate a scene without valid props');
    });

    return (
        <Show when={scene()} fallback={<div class="loading">Loading scene...</div>}>
            {(scn) => (
                <Card
                    parentType='acts'
                    parentId={props.actId}
                    entityType='scenes'
                    entityId={scn().id}
                    title={
                        <>
                            <span class="icon">🎬 </span>
                            <TextInput tooltip='Scene number' as='number' {...bindField('scenes', scn().id, 'number')} />
                            <TextInput {...bindField('scenes', scn().id, 'title')} />
                        </>
                    }
                    link={`/scene/${scn().id}`}
                    label={`View details for ${scn().title}`}
                    summary={props.summary}
                    class="scene-card"
                    menuItems={
                        <>
                            <BeatCreator sceneId={scn().id}>New Beat</BeatCreator>
                            <DeleteSceneButton sceneId={scn().id} />
                        </>
                    }
                >
                    <section class="scene-details">
                        <Show when={uiOptions.showSceneMetaData}>
                            <div class="scene-summary">
                                <TextInput
                                    as="textarea"
                                    placeholder="Scene summary"
                                    {...bindField('scenes', scn().id, 'summary')}
                                />
                            </div>

                            <h4>
                                Scene Locations
                                <AddLocation sceneId={scn().id} />
                            </h4>
                            <LocationCard sceneId={scn().id} locationId={scn().locationId} summary />

                            <h4>
                                Scene Characters <AddCharacter sceneId={scn().id} />
                            </h4>

                            <div class="scene-characters">
                                <CharacterList sceneId={scn().id} />
                            </div>

                            <h4>Scene Beats</h4>
                        </Show>

                        <BeatList sceneId={scn().id} />
                    </section>
                </Card>
            )}
        </Show>
    );
};

export default SceneCard;
