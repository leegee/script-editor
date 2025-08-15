// Routes.tsx
import { Route } from "@solidjs/router";
import Welcome from "./components/Welcome";
import Home from "./pages/home";
import CharacterDetails from "./components/CharacterDetails";
import LocationDetails from "./components/LocationDetails";
import ActList from "./components/lists/ActList";
import ActDetails from "./components/ActDetails";
import SceneDetails from "./components/SceneDetails";
import PlotList from "./components/lists/PlotList";
import PlotDetails from "./components/PlotDetails";

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
      <Route path="/plot" component={PlotDetails} />
      <Route path="/plots/:id" component={PlotDetails} />
      <Route path="/location/:id" component={LocationDetails} />
      <Route path="/act" component={ActList} />
      <Route path="/act/:id" component={ActDetails} />
      <Route path="/scene/:id" component={SceneDetails} />
      <Route path="/scene/:id/beat/:beatId" component={SceneDetails} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Route>
  );
}
