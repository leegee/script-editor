import { storyApi } from "../../stores/story"

interface DeleteCharacterButtonProps {
    characterId: string;
}

export default (props: DeleteCharacterButtonProps) => {
    const deleteCharacter = () => {
        if (confirm('Delete this Character?')) {
            storyApi.deleteEntity('characters', props.characterId);
        }
    };
    return (
        <button class='delete' onclick={deleteCharacter}>Delete</button>
    )
}