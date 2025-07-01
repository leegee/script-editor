import './home.scss';
import ActsList from '../components/lists/ActsList';
import LocationList from '../components/lists/LocationList';
import Card from '../components/cards/Card';
import CharacterList from '../components/lists/CharacterList';
import ActCreator from '../components/creators/ActCreator';
import Switch from '../components/Switch';
import { uiOptions, setUiOptions } from '../stores/ui';
import { Show } from 'solid-js';

export default function Home(props) {
  return (
    <main class="home-layout">
      <aside class="panel">
        <header>
          <span>
            Show <Switch checked={uiOptions.showLeftSidePanel} onUpdate={(checked) => setUiOptions('showLeftSidePanel', checked)} />
          </span>
        </header>
        <Show when={uiOptions.showLeftSidePanel}>
          <Card class="act-panel" title="Acts" open={true}>
            <ActsList />
            <ActCreator />
          </Card>
        </Show>
      </aside>

      <article class="main-content">
        {props.children}
      </article>

      <aside class="panel">
        <header>
          <span>
            Show <Switch checked={uiOptions.showRightSidePanel} onUpdate={(checked) => setUiOptions('showRightSidePanel', checked)} />
          </span>
        </header>
        <Show when={uiOptions.showRightSidePanel}>
          <Card class="character-panel" title="Characters" open={true}>
            <CharacterList />
          </Card>

          <Card class="location-panel" title="Location" open={true}>
            <LocationList />
          </Card>
        </Show>
      </aside>

    </main>
  );
}
