import { Match, Show, Switch, lazy } from "solid-js";
import { Navigate } from "solid-start";
import { useUser } from "~/providers/userProvider";

const LoginWithEmail = lazy(() => import("~/routes/login-with-email"));
const Prospect = lazy(() => import("~/routes/prospect/index"));
const Reference = lazy(() => import("~/routes/reference/index"));

function Home() {
  const { user, isLoaded } = useUser();
  
  return (
    <Show when={isLoaded()}>
      <Switch fallback={<LoginWithEmail />}>
        <Match when={user?.isProspect}>
          <Prospect />
        </Match>
        <Match when={user?.isReference}>
          <Reference />
        </Match>
        <Match when={user?.isVendor}>
          <Navigate href="/vendor" />
        </Match>
        <Match when={user}>
          <Navigate href="/" />
        </Match>
      </Switch>
    </Show>
  );
}

export default Home;
