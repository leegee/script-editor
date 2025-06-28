// pages/Home.tsx
import './home.scss';
import CharacterList from '../components/CharacterList';
import ActsList from '../components/ActsList';
import LocationList from '../components/LocationList';
import { createResource, Show, Suspense } from 'solid-js';
import { getCharacters, getActs, getLocations } from '../Routes';
import Card from '../components/Card';

export default function Home(props) {
  const [acts] = createResource(getActs);
  const [characters] = createResource(getCharacters);
  const [locations] = createResource(getLocations);

  return (
    <section class="home-layout">
      <aside class="act-panel">
        <Suspense fallback={<span>Loading acts...</span>}>
          <ActsList acts={acts()} />
        </Suspense>
      </aside>

      <main class="main-content">
        {props.children}
      </main>

      <aside class="right-panel">
        <Card class="character-panel" title="Characters" >
          <CharacterList />
        </Card>

        <Card class="location-panel" title="Location" >
          <LocationList />
        </Card>
      </aside>

    </section>
  );
}
