import './home.scss';
import LocationList from '../components/lists/LocationList';
import Card from '../components/cards/Card';
import CharacterList from '../components/lists/CharacterList';
import ActCreator from '../components/creators/ActCreator';
import { setUiOptions, uiOptions } from '../stores/ui';
import { createMemo } from 'solid-js';
import CharacterCreator from '../components/creators/CharacterCreator';
import LocationCreator from '../components/creators/LocationCreator';
import ActDetails from './ActDetails';
import PlotList from '../components/lists/PlotList';

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
    <main class={mainClass()}>
      <aside class={"panel left " + (uiOptions.showLeftSidePanel ? "open" : "closed")}>
        <Card class="act-panel" title="Acts" link='/act?summary=true' open
          menuItems={<><ActCreator /></>}
          parentType=''
          parentId=''
          entityType='acts'
          entityId={undefined}
          draggable={true}
        >
          <ActDetails summary={true} />
        </Card>
      </aside>

      <article class="main-content">
        {props.children}
      </article>

      <aside class={"panel right " + (uiOptions.showRightSidePanel ? "open" : "closed")}>
        <Card class="character-panel" title="Characters" link='/character' open
          menuItems={<>
            <button onClick={() => setUiOptions('showCharacterCreator', true)}>New Character</button>
          </>}
          parentType=''
          parentId=''
          entityType='characters'
          entityId={undefined}
          draggable={true}
        >
          <CharacterList />
        </Card>

        <Card class="location-panel" title="Locations" open link='/location'
          menuItems={<>
            <button onClick={() => setUiOptions('showLocationCreator', true)}>New Location</button>
          </>}
          parentType=''
          parentId=''
          entityType='locations'
          entityId={undefined}
          draggable={true}
        >
          <LocationList summary={true} />
        </Card>
        {/* 
        <Card class="plot-panel" title="Plots" open link='/plot'
          menuItems={
            <>
              <p></p>
              <PlotCreator />
            </>
          }
          parentType=''
          parentId=''
          entityType='plots'
          entityId={undefined}
          draggable={true}
        >
          <PlotList />
        </Card> */}
      </aside>

      <CharacterCreator open={uiOptions.showCharacterCreator} onClose={() => setUiOptions('showCharacterCreator', false)} />
      <LocationCreator open={uiOptions.showLocationCreator} onClose={() => setUiOptions('showLocationCreator', false)} />
    </main>

  );
}
