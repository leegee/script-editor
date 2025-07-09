import './ActCard.scss';

import { type Component, createResource, Show } from 'solid-js';
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
    actId?: string;   // now optional
    act?: Act;        // full act object optional
    summary?: boolean;
}

const ActCard: Component<ActCardProps> = (props) => {
    // Use act prop if given, otherwise fetch by actId
    const [act] = createResource(
        () => props.act ? null : props.actId,  // no fetch if act is provided
        async (id) => {
            if (!id) return undefined;
            return await storyApi.getAct(id);
        }
    );

    // actData is either from props.act or fetched act
    const actData = () => props.act ?? act();

    return (
        <Show when={actData()} fallback={<div class="loading">Loading act...</div>}>
            {(actValue) => (
                <Card
                    entityType="acts"
                    entityId={actValue().id}
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
                    class="act-card"
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

                        <h4>Characters present</h4>
                        <CharacterList actId={actValue().id} />

                        <h4>Locations used</h4>
                        <LocationList entityType="acts" entityId={actValue().id} />
                    </Show>

                    <hr />

                    <SceneList actId={actValue().id} />
                </Card>
            )}
        </Show>
    );
};

export default ActCard;