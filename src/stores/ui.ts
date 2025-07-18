import { makePersisted } from "@solid-primitives/storage";
import { createMemo } from "solid-js";
import { createStore } from "solid-js/store";

type UiOptionsType = {
    showActMetaData: boolean;
    showSceneMetaData: boolean;
    showBeatMetaData: boolean;
    showLeftSidePanel: boolean;
    showRightSidePanel: boolean;
    showStoryTree: boolean;
    showCharacterCreator: boolean,
    showLocationCreator: boolean,
};

const defaults: UiOptionsType = {
    showActMetaData: false,
    showSceneMetaData: false,
    showBeatMetaData: false,
    showLeftSidePanel: true,
    showRightSidePanel: true,
    showStoryTree: false,
    showCharacterCreator: false,
    showLocationCreator: false,
};

export const [uiOptions, setUiOptions] = makePersisted(
    createStore<UiOptionsType>(defaults),
    {
        name: "ui-options",
        storage: localStorage,
    }
);


