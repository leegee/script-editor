import './BeatCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import { useParams } from '@solidjs/router';
import { storyApi } from '../../stores/story';
import { bindField } from '../../lib/bind-field';
import Card from './Card';
import TextInput from '../TextInput';
import ScriptLineCard from './ScriptLineCard';
import BeatCreator from '../creators/BeatCreator';
import DeleteBeatButton from '../delete-buttons/DeleteBeatButton';

interface BeatCardProps {
    sceneId: string;
    beatId: string;
    summary?: boolean;
}

const BeatCard: Component<BeatCardProps> = (props) => {
    const params = useParams();
    const beat = createMemo(() => {
        return storyApi.getBeatBySceneIdBeatId(props.sceneId, props.beatId);
    });

    const scriptlines = createMemo(() => {
        if (!beat()) return [];
        return storyApi.getScriptLinesByBeatId(beat().id);
    });

    const addNewScriptLine = () => {
        storyApi.addNewScriptLineToBeat(beat().id)
    };

    const handleOnKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
            addNewScriptLine();
        }
    }

    return (
        <Show when={beat()} fallback={<div class="loading">Loading beat...</div>}>
            <Card
                entityType='beats'
                entityId={beat().id}
                link={`/scene/${props.sceneId}/beat/${props.beatId}`}
                label={`View details for Beat ${beat().id}`}
                summary={props.summary}
                class="beat-card"
                title={<TextInput {...bindField('beats', beat().id, 'title')} />}
                menuItems={
                    <>
                        <BeatCreator sceneId={props.sceneId}>New Beat</BeatCreator>
                        <DeleteBeatButton sceneId={props.sceneId} beatId={beat().id} />
                    </>
                }
            >
                <div class="beat-summary">
                    <TextInput as='textarea' placeholder='Summary' {...bindField('beats', beat().id, 'summary')} />
                </div>

                <section class="script-lines" tabIndex={0} onKeyUp={handleOnKeyUp}>
                    <For each={scriptlines()}>
                        {(line) => <ScriptLineCard line={line} />}
                    </For>

                    <button class='new' onclick={addNewScriptLine}>Line</button>

                </section>
            </Card>
        </Show>
    );
};

export default BeatCard;
