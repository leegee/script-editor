import './home.scss';
import ActsList from '../components/lists/ActsList';
import LocationList from '../components/lists/LocationList';
import Card from '../components/cards/Card';
import CharacterList from '../components/lists/CharacterList';
import ActCreator from '../components/creators/ActCreator';
import Switch from '../components/Switch';
import { uiOptions, setUiOptions } from '../stores/ui';
import { Show } from 'solid-js';
import CharacterCreator from '../components/creators/CharacterCreator';
import LocationCreator from '../components/creators/LocationCreator';

export default function Home(props) {
  return (
    <>
      <header class="home-layout-controls">
        <span>
          <Switch checked={uiOptions.showLeftSidePanel} onUpdate={(checked) => setUiOptions('showLeftSidePanel', checked)} />

          <Switch checked={uiOptions.showRightSidePanel} onUpdate={(checked) => setUiOptions('showRightSidePanel', checked)} />
        </span>
      </header>

      <main class="home-layout">
        <Show when={uiOptions.showLeftSidePanel}>
          <aside class="panel">
            <Card class="act-panel" title="Acts" open={true} menuItems={<ActCreator />}>
              <ActsList />
            </Card>
          </aside>
        </Show>

        <article class="main-content">
          {props.children}
        </article>

        <Show when={uiOptions.showRightSidePanel}>
          <aside class="panel right">
            <Card class="character-panel" title="Characters" open={true} menuItems={<CharacterCreator />}>
              <CharacterList />
            </Card>

            <Card class="location-panel" title="Location" open={true} menuItems={<LocationCreator />}>
              <LocationList />
            </Card>
          </aside>
        </Show>
      </main>
    </>
  );
}
