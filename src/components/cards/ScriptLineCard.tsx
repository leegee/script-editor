import "./ScriptLineCard.scss";
import { type Component, Show } from 'solid-js';
import Avatar from '../Avatar';
import TextInput from '../TextInput';
import { bindField } from '../../lib/bind-field';
import { ScriptLineNormalized, ScriptLineType } from '../../lib/types';
import { storyApi } from "../../stores/story";

interface ScriptLineCardProps {
    line: ScriptLineNormalized;
}

// const labelMap: Record<ScriptLineType, string> = {
//     [ScriptLineType.Dialogue]: 'Dialogue',
//     [ScriptLineType.Action]: 'Action',
//     [ScriptLineType.Description]: 'Description',
//     [ScriptLineType.Parenthetical]: 'Parenthetical',
// };

const ScriptLineCard: Component<ScriptLineCardProps> = (props) => {
    const { line } = props;

    // Get enum options:
    const lineTypeOptions = Object.values(ScriptLineType);

    return (
        <div class='script-line-container'>
            <label>
                <select
                    class='script-line-type'
                    value={line.type}
                    onChange={(e) =>
                        storyApi.updateEntity(
                            'scriptLines',
                            line.id,
                            'type',
                            e.currentTarget.value as ScriptLineType
                        )
                    }
                >
                    {lineTypeOptions.map((type) => (
                        <option value={type}>{type}</option>
                    ))}
                </select>
            </label>

            <blockquote class={`script-line script-line-${line.type.toLowerCase()}`}>
                <Show when={line.type === 'Dialogue'}>
                    <Avatar class="character"
                        characterId={line.characterId}
                        onChange={(e) =>
                            storyApi.updateEntity(
                                'scriptLines',
                                line.id,
                                'characterId',
                                (e.currentTarget as HTMLSelectElement).value as string
                            )
                        }

                    />
                </Show>

                <TextInput as='textarea' {...bindField('scriptLines', line.id, 'text')} />
            </blockquote>
        </div>
    );
};

export default ScriptLineCard;
