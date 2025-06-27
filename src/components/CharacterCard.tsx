import './CharacterCard.scss';
import { type Component, Show, For, createSignal } from 'solid-js';
import type { Character } from '../lib/types';
import { A } from '@solidjs/router';
import Find from './icons/find';
import Avatar from './Avatar';

interface CharacterCardProps {
    character: Character;
    "link-to-main"?: boolean;
}

const CharacterCard: Component<CharacterCardProps> = (props) => {
    const { character } = props;
    const [isOpen, setIsOpen] = createSignal(!props['link-to-main']);

    const toggleOpen = () => setIsOpen(!isOpen());

    return (
        <div
            class={`character-card ${isOpen() ? 'open' : ''}`}
            onClick={toggleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
            aria-expanded={isOpen()}
        >
            <Avatar
                avatarColor={character.avatarColor}
                avatarImage={character.avatarImage}
                avatarInitial={character.avatarInitial}
                name={character.name}
            />

            <div class="details">
                <h3 class="name">
                    {character.name}
                    <Show when={props['link-to-main']}>
                        <A href={`/character/${character.id}`} class="details-link" aria-label={`View details for ${character.name}`}>
                            <Find />
                        </A>
                    </Show>
                </h3>

                <Show when={isOpen()}>
                    <Show when={character.bio}>
                        <p class="bio">{character.bio}</p>
                    </Show>

                    <Show when={character.tags?.length}>
                        <div class="tags">
                            <For each={character.tags}>
                                {(tag) => <span class="tag">#{tag}</span>}
                            </For>
                        </div>
                    </Show>

                    <Show when={character.totalScreenTimeSeconds}>
                        <div class="meta">
                            Screen Time: {Math.round(character.totalScreenTimeSeconds!)}s
                        </div>
                    </Show>
                    <Show when={character.firstAppearanceSceneId}>
                        <div class="meta">
                            First Appeared in Scene: {character.firstAppearanceSceneId}
                        </div>
                    </Show>
                </Show>
            </div>
        </div >
    );
};

export default CharacterCard;
