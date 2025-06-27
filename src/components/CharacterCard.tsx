import './CharacterCard.scss';
import { type Component, Show, For, createSignal, onMount, createEffect } from 'solid-js';
import type { Character } from '../lib/types';
import { A } from '@solidjs/router';
import Find from './icons/find';
import Avatar from './Avatar';
import { fakeApi } from '../lib/fakeApi';

interface CharacterCardWithCharacter {
    character: Character;
    characterId?: never;
}

interface CharacterCardWithCharacterId {
    character?: never;
    characterId: string;
}

type CharacterCardProps = {
    "link-to-main"?: boolean;
} & (CharacterCardWithCharacter | CharacterCardWithCharacterId);

const CharacterCard: Component<CharacterCardProps> = (props) => {
    const [character, setCharacter] = createSignal<Character | null>(props.character ?? null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [isOpen, setIsOpen] = createSignal(!props['link-to-main']);

    const toggleOpen = () => setIsOpen(!isOpen());

    // If characterId is given but no character, fetch character data
    createEffect(() => {
        if (!props.character && props.characterId) {
            setLoading(true);
            setError(null);
            fakeApi.getCharacter(props.characterId)
                .then(data => {
                    setCharacter(data);
                    setError(null);
                })
                .catch(() => {
                    setError('Failed to load character');
                    setCharacter(null);
                })
                .finally(() => setLoading(false));
        }
    });

    return (
        <div
            class={`character-card ${isOpen() ? 'open' : ''}`}
            onClick={toggleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
            aria-expanded={isOpen()}
        >
            <Show
                when={!loading()}
                fallback={<div class="loading">Loading character...</div>}
            >
                <Show
                    when={!error() && character()}
                    fallback={<div class="error">{error()}</div>}
                >
                    <Avatar
                        avatarColor={character()?.avatarColor}
                        avatarImage={character()?.avatarImage}
                        avatarInitial={character()?.avatarInitial}
                        name={character()?.name || ''}
                    />

                    <div class="details">
                        <h3 class="name">
                            {character()?.name}
                            <Show when={props['link-to-main']}>
                                <A href={`/character/${character()?.id}`} class="details-link" aria-label={`View details for ${character()?.name}`}>
                                    <Find />
                                </A>
                            </Show>
                        </h3>

                        <Show when={isOpen()}>
                            <Show when={character()?.bio}>
                                <p class="bio">{character()?.bio}</p>
                            </Show>

                            <Show when={character()?.tags?.length}>
                                <div class="tags">
                                    <For each={character()?.tags}>
                                        {(tag) => <span class="tag">#{tag}</span>}
                                    </For>
                                </div>
                            </Show>

                            <Show when={character()?.totalScreenTimeSeconds}>
                                <div class="meta">
                                    Screen Time: {Math.round(character()!.totalScreenTimeSeconds!)}s
                                </div>
                            </Show>

                            <Show when={character()?.firstAppearanceSceneId}>
                                <div class="meta">
                                    First Appeared in Scene: {character()?.firstAppearanceSceneId}
                                </div>
                            </Show>
                        </Show>
                    </div>
                </Show>
            </Show>
        </div>
    );
};

export default CharacterCard;
