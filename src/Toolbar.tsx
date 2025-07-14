import './Toolbar.scss';
import Switch from "./components/Switch";
import { setUiOptions, uiOptions } from "./stores/ui";
import LoadStoryButton from './components/LoadStoryButton';
import SaveStoryButton from './components/SaveStoryButton';
import ResetStoryButton from './components/ResetStoryButton';
import OverflowMenu from './components/OverflowMenu';
import HomeButton from './components/HomeButton';

export default function () {
    return (<nav class="nav-bar">
        <ul>
            <li>
                <Switch checked={uiOptions.showLeftSidePanel} onUpdate={checked => setUiOptions('showLeftSidePanel', checked)} />
            </li>
            <li class='spacer'></li>
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
                <Switch checked={uiOptions.showSceneMetaData} onUpdate={(checked) => setUiOptions('showSceneMetaData', checked)} />
            </li>
            <li class='spacer'></li>
            <li>
                <Switch checked={uiOptions.showRightSidePanel} onUpdate={checked => setUiOptions('showRightSidePanel', checked)} />
            </li><li>
                <OverflowMenu>
                    <HomeButton />
                    <LoadStoryButton />
                    <SaveStoryButton />
                    <ResetStoryButton />
                </OverflowMenu>
            </li>
        </ul>
    </nav >
    )
};
