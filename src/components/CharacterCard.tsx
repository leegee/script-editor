import './CharacterCard.scss';
import { type Component, Show, For, createSignal } from 'solid-js';
import type { Character } from '../lib/types';

interface CharacterCardProps {
    character: Character;
}

const CharacterCard: Component<CharacterCardProps> = (props) => {
    const { character } = props;
    const [isOpen, setIsOpen] = createSignal(false);

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
            <div
                class="avatar"
                style={{ 'background-color': character.avatarColor ?? '#999' }}
            >
                <Show when={character.avatarImage}>
                    <img
                        src={character.avatarImage}
                        alt={character.name}
                        class="avatar-img"
                    />
                </Show>
                <Show when={!character.avatarImage}>
                    {character.avatarInitial ?? character.name[0]}
                </Show>
            </div>

            <div class="details">
                <h3 class="name">{character.name}</h3>

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
        </div>
    );
};

export default CharacterCard;
