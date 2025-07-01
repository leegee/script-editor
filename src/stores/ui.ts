import { createStore } from "solid-js/store";

type UiOptionsType = {
    showActMetaData: boolean;
    showActSceneaData: boolean;
};

const defaults: UiOptionsType = {
    showActMetaData: false,
    showActSceneaData: false,
};

export const [uiOptions, setUiOptions] = createStore<UiOptionsType>(defaults);
