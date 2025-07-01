import './home.scss';
import ActsList from '../components/lists/ActsList';
import LocationList from '../components/lists/LocationList';
import Card from '../components/cards/Card';
import CharacterList from '../components/lists/CharacterList';
import ActCreator from '../components/creators/ActCreator';

export default function Home(props) {
  return (
    <main class="home-layout">
      <aside class="panel">
        <h1>&nbsp;</h1>
        <Card class="act-panel" title="Acts" open={true}>
          <ActsList />
          <ActCreator />
        </Card>
      </aside>

      <article class="main-content">
        {props.children}
      </article>

      <aside class="panel">
        <h1>&nbsp;</h1>
        <Card class="character-panel" title="Characters" open={true}>
          <CharacterList />
        </Card>

        <Card class="location-panel" title="Location" open={true}>
          <LocationList />
        </Card>
      </aside>

    </main>
  );
}
