import { Component } from 'solid-js';
import { storyApi } from '../stores/story';

export const SaveStoryButton: Component = () => {
    const handleSaveClick = () => {
        const url = storyApi.asObjectUrl();

        const link = document.createElement('a');
        link.download = 'story.json';
        link.href = url;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        console.info('Story saved to JSON file:', link.download);
    };

    return (
        <button onClick={handleSaveClick}>
            📂 Save
        </button>
    );
};

export default SaveStoryButton;
