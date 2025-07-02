// src/components/LoadStoryButton.tsx

import { Component } from 'solid-js';
import { storyApi } from '../stores/story';

export const LoadStoryButton: Component = () => {
    let fileInputRef: HTMLInputElement | undefined;

    const handleFileChange = async (event: Event) => {
        const input = event.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const rawData = JSON.parse(text);
            storyApi.loadStoryFromJson(rawData);
            alert('Story loaded successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to load JSON. Make sure it’s a valid story file.');
        }
    };

    const triggerFileInput = () => {
        fileInputRef?.click();
    };

    return (
        <>
            <button onClick={triggerFileInput}>
                Load
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default LoadStoryButton;
