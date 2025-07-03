import './Toolbar.scss';
import { A } from "@solidjs/router";
import Switch from "./components/Switch";
import { setUiOptions, uiOptions } from "./stores/ui";
import LoadStoryButton from './components/LoadStoryButton';
import SaveStoryButton from './components/SaveStoryButton';
import ResetStoryButton from './components/ResetStoryButton';
import OverflowMenu from './components/OverflowMenu';

export default function () {
    return (<nav class="nav-bar">
        <ul>
            <li>
                <label>Story Tree</label>
                <Switch checked={uiOptions.showStoryTree} onUpdate={(checked) => setUiOptions('showStoryTree', checked)} />
            </li>
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
            <li>
                <OverflowMenu>
                    <ResetStoryButton />
                </OverflowMenu>
            </li>
        </ul>
    </nav>
    )
};
