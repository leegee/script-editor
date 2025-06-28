// Routes.tsx
import { Router, Route } from "@solidjs/router";
import Welcome from "./components/Welcome";
import Home from "./pages/home";
import CharacterDetails from "./pages/CharacterDetails";
import { fakeApi } from "./lib/fakeApi";
import { query } from "@solidjs/router";
import LocationDetails from "./pages/LocationDetails";
import ActDetails from "./pages/ActDetails";
import SceneDetails from "./pages/SceneDetails";

export const getLocations = query(() => fakeApi.getLocations(undefined), "locations");
export const getCharacters = query(() => fakeApi.getCharacters(undefined), "characters");
export const getActs = query(() => fakeApi.getActs(), "acts");

export default function Routes() {
  return (
    <Route
      path="/"
      component={Home}
      preload={() => {
        void getCharacters();
        void getActs();
      }}
    >
      <Route path="/" component={Welcome} />
      <Route path="/character/:id" component={CharacterDetails} />
      <Route path="/location/:id" component={LocationDetails} />
      <Route path="/scene/:id" component={SceneDetails} />
      <Route path="/act/:id" component={ActDetails} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Route>
  );
}
