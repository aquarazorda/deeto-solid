import { Match, Switch, lazy } from "solid-js";
import { Navigate } from 'solid-start';
import { useUser } from "~/providers/userProvider";

const LoginWithEmail = lazy(() => import("~/routes/login-with-email"));
const Prospect = lazy(() => import("~/routes/prospect/index"));
const Reference = lazy(() => import("~/routes/reference/index"));
const Vendor = lazy(() => import("~/routes/vendor"));

function Home() {
  const { user } = useUser();

  return (
    <Switch fallback={<LoginWithEmail />}>
      <Match when={user?.isProspect}>
        <Prospect />
      </Match>
      <Match when={user?.isReference}>
        <Reference />
      </Match>
      <Match when={user?.isVendor}>
        <Vendor />
      </Match>
      <Match when={user}>
        <Navigate href="/" />
      </Match>
    </Switch>
  );
}

export default Home;
