import './Toolbar.scss';
import { A } from "@solidjs/router";
import Switch from "./components/Switch";
import { setUiOptions, uiOptions } from "./stores/ui";

export default function () {
    return (<nav class="nav-bar">
        <ul>
            <li>
                <A href="/act" class="nav-link">Acts</A>
            </li>
            <li>
                <A href="/character" class="nav-link">Characters</A>
            </li>
            <li>
                <A href="/location" class="nav-link">Locations</A>
            </li>
            <li>
                <label>Act Meta</label>
                <Switch checked={uiOptions.showActMetaData} onUpdate={(checked) => setUiOptions('showActMetaData', checked)} />
            </li>
            <li>
                <label>Scene Meta</label>
                <Switch checked={uiOptions.showSceneData} onUpdate={(checked) => setUiOptions('showSceneData', checked)} />
            </li>
        </ul>
    </nav>
    )
};
