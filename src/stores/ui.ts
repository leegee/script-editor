import { createStore } from "solid-js/store";

type UiOptionsType = {
    showActMetaData: boolean;
    showSceneData: boolean;
    showLeftSidePanel: boolean;
    showRightSidePanel: boolean;
};

const defaults: UiOptionsType = {
    showActMetaData: false,
    showSceneData: false,
    showLeftSidePanel: true,
    showRightSidePanel: true,
};

export const [uiOptions, setUiOptions] = createStore<UiOptionsType>(defaults);
