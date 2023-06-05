import { Match, Switch, lazy } from "solid-js";
import { Navigate } from 'solid-start';
import { useUser } from "~/providers/userProvider";

const LoginWithEmail = lazy(() => import("~/routes/login-with-email"));

function Home() {
  const { user } = useUser();

  return (
    <Switch fallback={<LoginWithEmail />}>
      <Match when={user?.isProspect}>
        <Navigate href="/prospect" />
      </Match>
      <Match when={user?.isReference}>
        <Navigate href="/reference" />
      </Match>
      <Match when={user?.isVendor}>
        <Navigate href="/vendor" />
      </Match>
    </Switch>
  );
}

export default Home;
