import './home.scss';
import LocationList from '../components/lists/LocationList';
import Card from '../components/cards/Card';
import CharacterList from '../components/lists/CharacterList';
import ActCreator from '../components/creators/ActCreator';
import Switch from '../components/Switch';
import { uiOptions, setUiOptions } from '../stores/ui';
import { createMemo } from 'solid-js';
import CharacterCreator from '../components/creators/CharacterCreator';
import LocationCreator from '../components/creators/LocationCreator';
import ActDetails from './ActDetails';

export default function Home(props) {
  const mainClass = createMemo(() => {
    const left = uiOptions.showLeftSidePanel;
    const right = uiOptions.showRightSidePanel;
    if (left && right) return "home-layout both-open";
    if (left) return "home-layout left-open";
    if (right) return "home-layout right-open";
    return "home-layout";
  });

  return (
    <>
      <header class="home-layout-controls">
        <Switch checked={uiOptions.showLeftSidePanel} onUpdate={checked => setUiOptions('showLeftSidePanel', checked)} />
        <Switch checked={uiOptions.showRightSidePanel} onUpdate={checked => setUiOptions('showRightSidePanel', checked)} />
      </header>

      <main class={mainClass()}>
        <aside class={"panel left " + (uiOptions.showLeftSidePanel ? "open" : "closed")}>
          <Card class="act-panel" title="Acts" link='/act?summary=true' open
            menuItems={<><ActCreator /></>}
            entityType='acts'
            entityId={undefined}
            draggable={true}
            parentId=''
          >
            <ActDetails summary={true} />
          </Card>
        </aside>

        <article class="main-content">
          {props.children}
        </article>

        <aside class={"panel right " + (uiOptions.showRightSidePanel ? "open" : "closed")}>
          <Card class="character-panel" title="Characters" link='/character' open
            menuItems={<><CharacterCreator /></>}
            entityType='characters'
            entityId={undefined}
            draggable={true}
            parentId=''
          >
            <CharacterList />
          </Card>

          <Card class="location-panel" title="Location" open link='/location'
            menuItems={<><LocationCreator /></>}
            entityType='locations'
            entityId={undefined}
            draggable={true}
            parentId=''
          >
            <LocationList>Locations</LocationList>
          </Card>
        </aside>
      </main>
    </>
  );
}
