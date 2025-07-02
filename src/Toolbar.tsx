import './Toolbar.scss';
import { A } from "@solidjs/router";
import Switch from "./components/Switch";
import { setUiOptions, uiOptions } from "./stores/ui";
import LoadStoryButton from './components/LoadStoryButton';
import SaveStoryButton from './components/SaveStoryButton';

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
            <li class='spacer'></li>
            <li>
                <label>Act Info</label>
                <Switch checked={uiOptions.showActMetaData} onUpdate={(checked) => setUiOptions('showActMetaData', checked)} />
            </li>
            <li>
                <label>Scene Info</label>
                <Switch checked={uiOptions.showSceneData} onUpdate={(checked) => setUiOptions('showSceneData', checked)} />
            </li>
            <li class='spacer'></li>
            <li>
                <LoadStoryButton />
            </li>
            <li>
                <SaveStoryButton />
            </li>
        </ul>
    </nav>
    )
};
