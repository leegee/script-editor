import "./ScriptLineCard.scss";
import { type Component, createSignal, Show } from 'solid-js';
import Avatar from '../Avatar';
import TextInput from '../TextInput';
import { bindField } from '../../lib/bind-field';
import { ScriptLine, ScriptLineType } from '../../lib/types';
import { storyApi } from "../../stores/story";
import Card from './Card';

interface ScriptLineCardProps {
    line: ScriptLine;
    beatId: string;
}

const ScriptLineCard: Component<ScriptLineCardProps> = (props) => {
    const lineTypeOptions = Object.values(ScriptLineType);
    const [lineType, setLineType] = createSignal(props.line.type);

    const deleteThisLine = async () => {
        await Promise.allSettled([
            storyApi.findParentEntity('beats', 'scriptLineIds', props.line.id),
            storyApi.deleteEntity('scriptlines', props.line.id)
        ]);
    };

    return (
        <Card
            entityType="scriptlines"
            entityId={props.line.id}
            parentId={props.beatId}
            class={`script-line-card script-line-type-${lineType().toLowerCase()}`}
        >
            <div class="script-line-content">
                <label class="script-line-type-label">
                    <select
                        class="script-line-type"
                        value={lineType()}
                        onChange={(e) => {
                            const newType = e.currentTarget.value as ScriptLineType;
                            setLineType(newType);
                            storyApi.updateEntityField(
                                'scriptlines',
                                props.line.id,
                                'type',
                                newType
                            );
                            props.line.type = newType;
                        }}
                    >
                        {lineTypeOptions.map((type) => (
                            <option value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <blockquote class={`script-line script-line-${lineType().toLowerCase()}`}>
                    <Show when={lineType() === 'Dialogue'}>
                        <Avatar
                            class="character"
                            editable={true}
                            characterId={props.line.characterId}
                            onChange={(e) =>
                                storyApi.updateEntityField(
                                    'scriptlines',
                                    props.line.id,
                                    'characterId',
                                    (e.currentTarget as HTMLSelectElement).value as string
                                )
                            }
                        />
                    </Show>

                    <TextInput as="textarea" {...bindField('scriptlines', props.line.id, 'text')} />
                    !
                    <button class="delete" onClick={deleteThisLine}>🗑</button>
                </blockquote>
            </div>
        </Card>
    );
};

export default ScriptLineCard;