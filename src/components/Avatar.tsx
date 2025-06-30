import './Avatar.scss';
import { storyApi } from '../lib/story';
import { createSignal, createMemo, type Component, Show, For } from 'solid-js';
import { bindField } from '../lib/bind-field';
import TextInput from './Input';

interface AvatarProps {
    characterId?: string;
    showName?: boolean;
    class?: string;
    isNew?: boolean;  // new prop to control editing mode
}

const Avatar: Component<AvatarProps> = (props) => {
    const allCharacters = storyApi.getCharacters();

    // Use initial selectedId either from props.characterId or first character
    const [selectedId, setSelectedId] = createSignal(props.characterId ?? allCharacters[0]?.id);

    const character = createMemo(() => {
        const id = selectedId();
        return id ? storyApi.getCharacter(id) : undefined;
    });

    const showName = props.showName ?? true;
    const isNew = props.isNew ?? false;

    return (
        <aside class={`avatar ${props.class ?? ''}`}>
            <Show when={character()}>
                <div
                    class="avatar-circle"
                    style={{ 'background-color': character()!.avatarColor ?? '#999' }}
                >
                    <Show when={character()!.avatarImage} fallback={
                        character()!.name.substring(0, 1) ?? character()!.name[0]
                    }>
                        <img src={character()!.avatarImage} alt={character()!.name} class="avatar-img" />
                    </Show>
                </div>

                {/* Show dropdown only when NOT isNew */}
                <Show when={!isNew}>
                    <select
                        value={selectedId()}
                        onInput={(e) => setSelectedId((e.target as HTMLSelectElement).value)}
                    >
                        <For each={allCharacters}>
                            {(c) => (
                                <option value={c.id}>{c.name}</option>
                            )}
                        </For>
                    </select>
                </Show>

                {/* Show name input only when isNew is true */}
                <Show when={isNew && showName && character()}>
                    <em>
                        <TextInput {...bindField('characters', character()!.id, 'name')} />
                    </em>
                </Show>
            </Show>
        </aside>
    );
};

export default Avatar;