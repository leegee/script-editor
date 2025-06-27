// Routes.tsx
import { Router, Route } from "@solidjs/router";
import Welcome from "./components/Welcome";
import Home from "./pages/home";
import CharacterDetails from "./pages/CharacterDetails";
import { fakeApi } from "./lib/fakeApi";
import { query } from "@solidjs/router";

export const getCharacters = query(() => fakeApi.getCharacters(), "characters");
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
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Route>
  );
}
