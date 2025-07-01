import { createStore } from "solid-js/store";

type UiOptionsType = {
    showActMetaData: boolean;
    showSceneData: boolean;
};

const defaults: UiOptionsType = {
    showActMetaData: false,
    showSceneData: false,
};

export const [uiOptions, setUiOptions] = createStore<UiOptionsType>(defaults);
