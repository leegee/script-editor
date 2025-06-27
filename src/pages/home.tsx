// pages/Home.tsx
import './home.scss';
import CharacterList from '../components/CharacterList';
import ActsList from '../components/ActsList';
import { createResource, Suspense } from 'solid-js';
import { getCharacters, getActs } from '../Routes';

export default function Home(props) {
  const [acts] = createResource(getActs);
  const [characters] = createResource(getCharacters);

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

      <aside class="character-panel">
        <Suspense fallback={<span>Loading characters...</span>}>
          <CharacterList characters={characters()} />
        </Suspense>
      </aside>
    </section>
  );
}
