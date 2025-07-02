import { Component } from 'solid-js';
import { storyApi } from '../stores/story';

export const ResetStoryButton: Component = () => {
    const handleReset = () => {
        if (confirm('Are you sure you want to reset the story? This cannot be undone.')) {
            storyApi.resetStory();
            alert('Story has been reset to empty.');
        }
    };

    return (
        <button onClick={handleReset} >♻️ Reset</button >
    );
};

export default ResetStoryButton;
