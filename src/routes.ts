// routes.ts
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import Welcome from './components/Welcome';
import CharacterDetails from './pages/CharacterDetails';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: Welcome
      },
      {
        path: 'character/:id',
        component: CharacterDetails
      },
    ],
  },
];
