// pages/Home.tsx
import './home.scss';
import CharacterList from '../components/CharacterList';
import ActsList from '../components/ActsList';
import { createEffect, createResource, Show, Suspense } from 'solid-js';
import { getCharacters, getActs } from '../Routes';

export default function Home(props) {
  const [acts] = createResource(getActs);
  const [characters] = createResource(getCharacters);

  createEffect(() => {
    console.log('xxxxxxxxxx', acts(), characters())
  });

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
          <Show when={characters()} fallback={null}>
            {(chars) => <CharacterList characters={chars()} />}
          </Show>
        </Suspense>

      </aside>
    </section>
  );
}
