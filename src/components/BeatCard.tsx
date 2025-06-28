import './BeatCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import { story } from '../lib/fakeApi'; // your normalized store
import Card from './Card';
import Avatar from './Avatar';

interface BeatCardProps {
    sceneId: string;
    beatId: string;
    summary?: boolean;
}

const BeatCard: Component<BeatCardProps> = (props) => {
    const beat = createMemo(() => {
        const scene = story.scenes[props.sceneId];
        if (!scene) return undefined;
        return story.beats[props.beatId];
    });

    // Get characters once (all characters in store)
    const allCharacters = createMemo(() => Object.values(story.characters));

    // Get script lines for the beat
    const scriptLines = createMemo(() => {
        if (!beat()) return [];
        return beat()!.scriptLineIds
            .map(id => story.scriptLines[id])
            .filter(Boolean);
    });

    return (
        <Show when={beat()} fallback={<div class="loading">Loading beat...</div>}>
            <Card
                title={beat()!.title ?? 'Untitled Beat'}
                link={`/scene/${props.sceneId}/beat/${props.beatId}`}
                label={`View details for Beat ${beat()!.id}`}
                summary={props.summary}
                class="beat-card"
            >
                <Show when={beat()!.summary}>
                    <p class="summary">Summary: {beat()!.summary}</p>
                </Show>

                <section class="script-lines">
                    <For each={scriptLines()}>
                        {(line) => {
                            const character = allCharacters().find(c => c.id === line.characterId);
                            return (
                                <blockquote class={`script-line script-line-${line.type.toLowerCase()}`}>
                                    <Show when={character}>
                                        <div class="character">
                                            <Avatar
                                                avatarColor={character!.avatarColor}
                                                avatarImage={character!.avatarImage}
                                                avatarInitial={character!.avatarInitial}
                                                name={character!.name}
                                            />
                                            <strong>{character!.name}:</strong>
                                        </div>
                                    </Show>
                                    <span>{line.text}</span>
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
