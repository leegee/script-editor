import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';
import { fakeApi } from './lib/fakeApi';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    preload: AboutData,
  },
  {
    path: '/characters',
    component: lazy(() => import('./pages/characters')),
    preload: fakeApi.getCharacters,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
