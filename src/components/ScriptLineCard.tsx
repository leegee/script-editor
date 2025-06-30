import { type Component, Show } from 'solid-js';
import Avatar from './Avatar';
import TextInput from './Input';
import { bindField } from '../lib/bind-field';
import { ScriptLineNormalized } from '../lib/types';

interface ScriptLineCardProps {
    line: ScriptLineNormalized;
}

const ScriptLineCard: Component<ScriptLineCardProps> = (props) => {
    const { line } = props;

    return (
        <blockquote class={`script-line script-line-${line.type.toLowerCase()}`}>
            <Show when={line.characterId}>
                <div class="character">
                    <Avatar characterId={line.characterId} />
                </div>
            </Show>

            <TextInput {...bindField('scriptLines', line.id, 'text')} />
        </blockquote>
    );
};

export default ScriptLineCard;
