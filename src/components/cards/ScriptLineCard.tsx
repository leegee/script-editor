import "./ScriptLineCard.scss";
import { type Component, createSignal, Show } from 'solid-js';
import Avatar from '../Avatar';
import TextInput from '../TextInput';
import { bindField } from '../../lib/bind-field';
import { ScriptLine, ScriptLineType } from '../../lib/types';
import { storyApi } from "../../stores/story";

interface ScriptLineCardProps {
    line: ScriptLine;
    onChange?: () => void;
}

const ScriptLineCard: Component<ScriptLineCardProps> = (props) => {
    const lineTypeOptions = Object.values(ScriptLineType);
    const [lineType, setLineType] = createSignal(props.line.type);

    const deleteThisLine = async () => {
        await Promise.allSettled([
            storyApi.findParentEntity('beats', 'scriptLineIds', props.line.id),
            storyApi.deleteEntity('scriptlines', props.line.id)
        ]);
        props.onChange?.();
    };

    return (
        <div
            class="script-line-container"
            classList={{
                [`script-line-type-${lineType().toLowerCase()}`]: true,
            }}
        >
            <label>
                <select
                    class='script-line-type'
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

            <blockquote
                class="script-line"
                classList={{
                    [`script-line-${lineType().toLowerCase()}`]: true
                }}
            >
                <Show when={lineType() === 'Dialogue'}>
                    <Avatar
                        class="character"
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

                <TextInput as='textarea' {...bindField('scriptlines', props.line.id, 'text')} />

                <button class='delete' onClick={deleteThisLine}>🗑</button>
            </blockquote>
        </div>
    );
};

export default ScriptLineCard;