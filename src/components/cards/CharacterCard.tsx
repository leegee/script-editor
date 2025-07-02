import './CharacterCard.scss';
import { type Component, Show, For, createMemo } from 'solid-js';
import type { Character } from '../../lib/types';
import Avatar from '../Avatar';
import { storyApi } from '../../stores/story';
import Card from './Card';
import { bindField } from '../../lib/bind-field';
import TextInput from '../TextInput';
import DeleteCharacterButton from '../delete-buttons/DeleteCharacterButton';
import UnlinkCharacterScene from '../delete-buttons/UnlinkCharacterScene';

interface CharacterCardProps {
    summary?: boolean;
    character?: Character;
    characterId?: string;
    sceneId?: string;
}

const CharacterCard: Component<CharacterCardProps> = (props) => {
    const character = createMemo<Character | undefined>(() => {
        if (props.character) return props.character;
        if (props.characterId) {
            return storyApi.getCharacter(props.characterId);
        }
        return undefined;
    });

    const menuItems = [<DeleteCharacterButton characterId={character().id} />];

    if (props.sceneId) {
        menuItems.push(<UnlinkCharacterScene sceneId={props.sceneId} characterId={character().id} />)
    }

    return (
        <Show when={character()} fallback={<div class="loading">Loading character...</div>}>
            <Card
                link={`/character/${character()!.id}`}
                label={`View details for ${character()!.name}`}
                summary={!!props.summary}
                class="character-card"
                title={<Avatar characterId={character().id} />}
                menuItems={menuItems}
            >
                <div class='character-content'>
                    <p class="bio">
                        <TextInput {...bindField('characters', character().id, 'bio')} />
                    </p>

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

                </div>
            </Card>
        </Show >
    );
};

export default CharacterCard;
