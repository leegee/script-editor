import { Suspense, type Component } from 'solid-js';
import { A, useLocation } from '@solidjs/router';

const App: Component = (props: { children: Element }) => {
  const location = useLocation();

  return (
    <>
      <nav class="nav-bar">
        <ul class="nav-list">
          <li class="nav-item">
            <A href="/" class="nav-link">
              Home
            </A>
          </li>
          <li class="nav-item">
            <A href="/about" class="nav-link">
              About
            </A>
          </li>
        </ul>
      </nav>

      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;
