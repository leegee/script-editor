import { createStore } from "solid-js/store";

type UiOptionsType = {
    showActMetaData: boolean;
};

const defaults: UiOptionsType = {
    showActMetaData: false,
};

export const [uiOptions, setUiOptions] = createStore<UiOptionsType>(defaults);
