// Routes.tsx
import { Route } from "@solidjs/router";
import Welcome from "./components/Welcome";
import Home from "./pages/home";
import CharacterDetails from "./pages/CharacterDetails";
import LocationDetails from "./pages/LocationDetails";
import ActDetails from "./pages/ActDetails";
import SceneDetails from "./pages/SceneDetails";

export default function Routes() {
  return (
    <Route
      path="/"
      component={Home}
    >
      <Route path="/" component={Welcome} />
      <Route path="/character" component={CharacterDetails} />
      <Route path="/character/:id" component={CharacterDetails} />
      <Route path="/location" component={LocationDetails} />
      <Route path="/location/:id" component={LocationDetails} />
      <Route path="/act" component={ActDetails} />
      <Route path="/act/:id" component={ActDetails} />
      <Route path="/scene/:id" component={SceneDetails} />
      <Route path="/scene/:id/beat/:beatId" component={SceneDetails} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Route>
  );
}
