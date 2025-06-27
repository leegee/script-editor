import './Avatar.scss';
import { type Component, Show } from 'solid-js';

interface AvatarProps {
    avatarColor?: string;
    avatarImage?: string;
    avatarInitial?: string;
    name: string;
}

const Avatar: Component<AvatarProps> = (props) => {
    return (
        <div
            class="avatar"
            style={{ 'background-color': props.avatarColor ?? '#999' }}
        >
            <Show when={props.avatarImage}>
                <img src={props.avatarImage} alt={props.name} class="avatar-img" />
            </Show>
            <Show when={!props.avatarImage}>
                {props.avatarInitial ?? props.name[0]}
            </Show>
        </div>
    );
};

export default Avatar;
