import type { Component } from "solid-js"
import { storyApi } from "../../stores/story";

export interface BeatCreatorProps {
    sceneId: string;
}

export default function (props: BeatCreatorProps) {
    const addNewBeat = () => {
        storyApi.createEntity(
            'beats',
            {
                title: 'New Beat',
                scriptLineIds: [],
                number: storyApi.getNextInSequence('beats'),
            },
            {
                parentType: 'scenes',
                parentId: props.sceneId,
                parentListField: 'beatIds'
            }
        );
    };
    return (
        <button class='new' onclick={addNewBeat}>Beat</button>
    );
}