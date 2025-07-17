import './ActCard.scss';
import { type Component, createResource, Show, createSignal } from 'solid-js';
import { storyApi } from '../../stores/story';
import { uiOptions } from '../../stores/ui';
import SceneList from '../lists/SceneList';
import Card from './Card';
import TextInput from '../TextInput';
import { bindField } from '../../lib/bind-field';
import SceneCreator from '../creators/SceneCreator';
import DeleteActButton from '../delete-buttons/DeleteActButton';
import ActCreator from '../creators/ActCreator';
import LocationList from '../lists/LocationList';
import CharacterList from '../lists/CharacterList';
import { Act } from '../../lib/types';

interface ActCardProps {
    actId?: string;
    act?: Act;
    summary?: boolean;
    storyId?: string;
}

const ActCard: Component<ActCardProps> = (props) => {
    const [actResource] = storyApi.useAct(props.actId);
    const actData = () => props.act ?? actResource();

    return (
        <Show when={actData()} fallback={<div class="loading">No acts found.</div>}>
            {(actValue) => (
                <Card
                    parentId=''
                    parentType=''
                    entityType="acts"
                    entityId={actValue().id}
                    class="act-card"
                    title={
                        <>
                            <span class="icon">🎭</span>
                            <TextInput as="number" {...bindField('acts', actValue().id, 'number')} />
                            <TextInput {...bindField('acts', actValue().id, 'title')} />
                        </>
                    }
                    link={`/act/${actValue().id}`}
                    label={`View details for Act ${actValue().number}`}
                    summary={!!props.summary}
                    menuItems={
                        <>
                            <ActCreator />
                            <SceneCreator actId={actValue().id} />
                            <DeleteActButton actId={actValue().id} />
                        </>
                    }
                >
                    <Show when={uiOptions.showActMetaData}>
                        <div class="act-summary">
                            <TextInput
                                as="textarea"
                                placeholder="Act summary"
                                {...bindField('acts', actValue().id, 'summary')}
                            />
                        </div>

                        <div class="character-list-header">
                            <h4>Characters present
                                {/* <small><button class="refresh-icon" onClick={handleRefreshCharacters}>↻  Refresh</button></small> */}
                            </h4>
                        </div>
                        <CharacterList actId={actValue().id} />

                        <LocationList entityType="acts" entityId={actValue().id}>
                            Locations used
                        </LocationList>
                    </Show>

                    <section class="scenes" >
                        <SceneList actId={actValue().id} />
                    </section>
                </Card>
            )}
        </Show>
    );
};

export default ActCard;