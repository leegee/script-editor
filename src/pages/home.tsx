import './home.scss';
import CharacterList from '../components/CharacterList';
import { Suspense } from 'solid-js';
import { createAsync } from '@solidjs/router';
import { fakeApi } from '../lib/fakeApi';
import ActsList from '../components/ActsList';

export default function Home() {
  const characters = createAsync(fakeApi.getCharacters);
  const acts = createAsync(fakeApi.getActs);

  return (
    <section class="home-layout">
      <aside class="act-panel">
        <Suspense fallback={<span>Loading acts...</span>}>
          <ActsList acts={acts()} />
        </Suspense>
      </aside>

      <aside class="character-panel">
        <Suspense fallback={<span>Loading characters...</span>}>
          <CharacterList characters={characters()} />
        </Suspense>
      </aside>

      <main class="main-content">
        <h1>Welcome</h1>
        <p>Select a character to view more details.</p>
      </main>
    </section>
  );
}
