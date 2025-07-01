import './BeatCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import { storyApi } from '../../lib/story';
import { bindField } from '../../lib/bind-field';
import Card from './Card';
import TextInput from '../TextInput';
import ScriptLineCard from './ScriptLineCard';
import { ScriptLineType } from '../../lib/types';

interface BeatCardProps {
    sceneId: string;
    beatId: string;
    summary?: boolean;
}

const BeatCard: Component<BeatCardProps> = (props) => {
    const beat = createMemo(() => {
        return storyApi.getBeatBySceneIdBeatId(props.sceneId, props.beatId);
    });

    const scriptLines = createMemo(() => {
        if (!beat()) return [];
        return storyApi.getScriptLinesByBeatId(beat().id);
    });

    const addNewScriptLine = () => {
        storyApi.createEntity(
            'scriptLines',
            {
                text: 'New Script Line',
                type: 'Dialogue' as ScriptLineType,
            },
            {
                parentType: 'beats',
                parentId: props.beatId,
                parentListField: 'scriptLineIds'
            }
        );
    };

    return (
        <Show when={beat()} fallback={<div class="loading">Loading beat...</div>}>
            <Card
                // link={`/scene/${props.sceneId}/beat/${props.beatId}`}
                label={`View details for Beat ${beat().id}`}
                summary={props.summary}
                class="beat-card"
                title={
                    <TextInput {...bindField('beats', beat().id, 'title')} />
                }
            >
                <p class="beat-summary-text">
                    <TextInput placeholder='Summary' {...bindField('beats', beat().id, 'summary')} />
                </p>

                <section class="script-lines">
                    <For each={scriptLines()}>
                        {(line) => <ScriptLineCard line={line} />}
                    </For>

                    <button class='new' onclick={addNewScriptLine}>Script Line</button>

                </section>
            </Card>
        </Show>
    );
};

export default BeatCard;
