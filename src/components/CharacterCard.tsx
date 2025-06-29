import './CharacterCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Character } from '../lib/types';
import Avatar from './Avatar';
import { fakeApi } from '../lib/fakeApi';
import Card from './Card';

interface CharacterCardProps {
    summary?: boolean;
    character?: Character;
    characterId?: string;
}

const CharacterCard: Component<CharacterCardProps> = (props) => {
    const character = createMemo<Character | undefined>(() => {
        if (props.character) return props.character;
        if (props.characterId) {
            return fakeApi.getCharacter(props.characterId);
        }
        return undefined;
    });

    return (
        <Show when={character()} fallback={<div class="loading">Loading character...</div>}>
            <Card
                link={props.summary ? `/character/${character()!.id}` : undefined}
                label={`View details for ${character()!.name}`}
                summary={!!props.summary}
                class="character-card"
                title={
                    <>
                        <Avatar
                            avatarColor={character()!.avatarColor}
                            avatarImage={character()!.avatarImage}
                            avatarInitial={character()!.avatarInitial}
                            name={character()!.name}
                        />
                        {character()!.name}
                    </>
                }
            >

                <Show when={character()!.bio}>
                    <p class="bio">{character()!.bio}</p>
                </Show>

                <Show when={character()!.tags?.length}>
                    <div class="tags">
                        <For each={character()!.tags}>
                            {(tag) => <span class="tag">#{tag}</span>}
                        </For>
                    </div>
                </Show>

                {/* 
          <Show when={character()!.totalScreenTimeSeconds}>
            <div class="meta">
              Screen Time: {Math.round(character()!.totalScreenTimeSeconds!)}s
            </div>
          </Show>

          <Show when={character()!.firstAppearanceSceneId}>
            <div class="meta">
              First Appeared in Scene: {character()!.firstAppearanceSceneId}
            </div>
          </Show> 
          */}
            </Card>
        </Show >
    );
};

export default CharacterCard;
