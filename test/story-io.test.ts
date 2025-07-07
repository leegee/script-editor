import './setup';
import { describe, it, expect, beforeEach } from 'bun:test';
import { storyApi, story, setStory } from '../src/stores/story';
import rawStoryData from '../story.json' assert { type: 'json' };

describe('StoryService saving and loading', () => {
    beforeEach(() => {
        storyApi.loadStoryFromJson(rawStoryData);
    });

    it('should save current story using asObjectUrl() and reload it properly', async () => {
        // Get the blob URL representing the save data
        const url = storyApi.asObjectUrl();
        expect(typeof url).toBe('string');
        expect(url.startsWith('blob:')).toBe(true);

        // Fetch the Blob from the blob URL
        const response = await fetch(url);
        const text = await response.text();

        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(10);

        // Parse JSON and reset the story
        const parsedStory = JSON.parse(text);
        setStory({
            stories: {},
            acts: {},
            scenes: {},
            beats: {},
            scriptlines: {},
            characters: {},
            locations: {},
        });
        expect(Object.keys(story.stories).length).toBe(0);

        // Load from parsed JSON
        storyApi.loadStoryFromJson(parsedStory);

        // Get loaded story and verify
        const loadedStory = storyApi.getStory();
        expect(loadedStory).toBeDefined();
        expect(Object.keys(story.stories).length).toBeGreaterThan(0);
        expect(Object.keys(story.acts).length).toBeGreaterThan(0);
        expect(loadedStory?.title).toBeDefined();

        // Clean up: revoke the blob URL to avoid memory leaks
        URL.revokeObjectURL(url);
    });
});
