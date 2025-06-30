import './Avatar.scss';
import { storyApi } from '../lib/story';
import { type Component, Show } from 'solid-js';
import { bindField } from '../lib/bind-field';
import TextInput from './Input';

interface AvatarProps {
    characterId: string;
    showName?: boolean;
    class?: string;
}

const Avatar: Component<AvatarProps> = (props) => {
    const character = storyApi.getCharacter(props.characterId);
    const showName = props.showName ?? true;
    return (
        <aside class={`avatar ${props.class ?? ''}`}>
            <div
                class="avatar-circle"
                style={{ 'background-color': character.avatarColor ?? '#999' }}
            >
                <Show when={character.avatarImage}>
                    <img src={character.avatarImage} alt={character.name} class="avatar-img" />
                </Show>
                <Show when={!character.avatarImage}>
                    {character.avatarInitial ?? character.name[0]}
                </Show>
            </div>
            <Show when={showName}>
                <em>
                    <TextInput {...bindField('characters', character.id, 'name')} />
                </em>
            </Show>
        </aside>
    );
};

export default Avatar;
