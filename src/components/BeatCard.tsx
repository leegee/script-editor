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
                title={beat().title ?? 'Untitled Beat'}
                // link={`/scene/${props.sceneId}/beat/${props.beatId}`}
                label={`View details for Beat ${beat().id}`}
                summary={props.summary}
                class="beat-card"
            >
                <Show when={beat().summary}>
                    <p class="summary">Summary: {beat().summary}</p>
                </Show>

                <section class="script-lines">
                    <For each={scriptLines()}>
                        {(line) => {
                            const character = storyApi.getCharacter(line.characterId);
                            const field = bindField('scriptLines', line.id, 'text');

                            return (
                                <blockquote class={`script-line script-line-${line.type.toLowerCase()}`}>
                                    <Show when={character}>
                                        <div class="character">
                                            <Avatar
                                                avatarColor={character.avatarColor}
                                                avatarImage={character.avatarImage}
                                                avatarInitial={character.avatarInitial}
                                                name={character.name}
                                            />
                                            <strong>{character.name}:</strong>
                                        </div>
                                    </Show>

                                    <TextInput
                                        value={field.value}
                                        as={field.as}
                                        onBlur={field.onBlur}
                                    />
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
