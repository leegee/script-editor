import './CharacterCard.scss';
import { type Component, Show, For, createSignal, onMount, createEffect } from 'solid-js';
import type { Character } from '../lib/types';
import { A } from '@solidjs/router';
import Find from './icons/Find';
import Avatar from './Avatar';
import { fakeApi } from '../lib/fakeApi';
import CharacterHeader from './card/CharacterHeader';

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

    const toggleOpen = () => {
        if (props['link-to-main']) {
            setIsOpen(!isOpen());
        }
    }

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
            tabIndex={0}
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
                    <CharacterHeader
                        title={character().name}
                        link={props["link-to-main"] ? `/character/${character().id}` : undefined}
                        label={`View details for ${character().name}`}
                        toggleOpen={props["link-to-main"] ? toggleOpen : () => void 0}
                        class="character-header"
                    >
                        <Avatar
                            avatarColor={character()?.avatarColor}
                            avatarImage={character()?.avatarImage}
                            avatarInitial={character()?.avatarInitial}
                            name={character()?.name || ''}
                        />
                    </CharacterHeader>

                    <div class="details">
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
            </Show >
        </div >
    );
};

export default CharacterCard;
