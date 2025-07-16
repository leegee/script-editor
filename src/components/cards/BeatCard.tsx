import './BeatCard.scss';
import { type Component, Show, For, createResource, createSignal, createMemo } from 'solid-js';
import { storyApi } from '../../stores/story';
import { bindField } from '../../lib/bind-field';
import Card from './Card';
import TextInput from '../TextInput';
import ScriptLineCard from './ScriptLineCard';
import BeatCreator from '../creators/BeatCreator';
import DeleteBeatButton from '../delete-buttons/DeleteBeatButton';
import { uiOptions } from '../../stores/ui';

interface BeatCardProps {
    sceneId: string;
    beatId: string;
    summary?: boolean;
}

const BeatCard: Component<BeatCardProps> = (props) => {
    const [beat] = storyApi.useBeat(() => props.beatId);

    const [scriptlines] = storyApi.useScriptlinesByBeatId(() => props.beatId);

    const addNewScriptLine = async () => {
        storyApi.addNewScriptLineToBeat(beat().id);
    };

    const handleOnKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
            addNewScriptLine();
        }
    };

    return (
        <Show when={beat()} fallback={<div class="loading">Loading beat...</div>}>
            <Card
                parentId={props.sceneId}
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

                <Show when={uiOptions.showBeatMetaData}>
                    <div class="beat-summary">
                        <TextInput as='textarea' placeholder='Summary' {...bindField('beats', beat().id, 'summary')} />
                    </div>
                </Show>

                <section class="script-lines" tabIndex={0} onKeyUp={handleOnKeyUp}>
                    <For each={scriptlines()}>
                        {(line) => <ScriptLineCard line={line} beatId={beat().id} />}
                    </For>

                    <button class='new' onclick={addNewScriptLine}>Line</button>

                </section>
            </Card>
        </Show>
    );
};

export default BeatCard;