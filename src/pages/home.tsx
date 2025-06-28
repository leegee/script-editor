import './home.scss';
import CharacterList from '../components/CharacterList';
import ActsList from '../components/ActsList';
import LocationList from '../components/LocationList';
import Card from '../components/Card';

export default function Home(props) {
  return (
    <section class="home-layout">
      <aside class="panel">
        <Card class="act-panel" title="Acts" >
          <ActsList />
        </Card>
      </aside>

      <main class="main-content">
        {props.children}
      </main>

      <aside class="panel">
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
