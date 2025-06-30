import { storyApi } from "../lib/story";

export default () => {

    const addNewCharacter = () => {
        storyApi.createEntity(
            'characters',
            {
                name: 'New Character',
                avatarColor: 'pink',
                avatarImage: ''
            }
        );
    };

    return <button class='new' onclick={addNewCharacter}>New Character</button>;
}

