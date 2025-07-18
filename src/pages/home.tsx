import './home.scss';
import LocationList from '../components/lists/LocationList';
import Card from '../components/cards/Card';
import CharacterList from '../components/lists/CharacterList';
import ActCreator from '../components/creators/ActCreator';
import { uiOptions } from '../stores/ui';
import { createMemo, createSignal } from 'solid-js';
import CharacterCreator from '../components/creators/CharacterCreator';
import LocationCreator from '../components/creators/LocationCreator';
import ActDetails from './ActDetails';
import PlotList from '../components/lists/PlotList';

export default function Home(props) {

  const [showCharacterCreator, setShowCharacterCreator] = createSignal(false);
  const [showLocationCreator, setShowLocationCreator] = createSignal(false);

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
            <button onClick={() => setShowCharacterCreator(true)}>New Character</button>
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
            <button onClick={() => setShowLocationCreator(true)}>New Location</button>
          </>}
          parentType=''
          parentId=''
          entityType='locations'
          entityId={undefined}
          draggable={true}
        >
          <LocationList />
        </Card>

        <Card class="plot-panel" title="Plots" open link='/plot'
          menuItems={
            <>
              <p></p>
              {/* <PlotCreator /> */}
            </>
          }
          parentType=''
          parentId=''
          entityType='plots'
          entityId={undefined}
          draggable={true}
        >
          <PlotList />
        </Card>
      </aside>

      <CharacterCreator open={showCharacterCreator()} onClose={() => setShowCharacterCreator(false)} />
      <LocationCreator open={showLocationCreator()} onClose={() => setShowLocationCreator(false)} />
    </main>

  );
}
