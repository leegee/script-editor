import './BeatCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import { storyApi } from '../lib/story';
import { bindField } from '../lib/bind-field';
import TextInput from './Input';
import Card from './Card';
import Avatar from './Avatar';

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
                <Show when={beat().summary}>
                    <p class="summary">Summary:
                        <TextInput {...bindField('beats', beat().id, 'summary')} />
                    </p>
                </Show>

                <section class="script-lines">
                    <For each={scriptLines()}>
                        {(line) => {
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
                        }}
                    </For>
                </section>
            </Card>
        </Show>
    );
};

export default BeatCard;
