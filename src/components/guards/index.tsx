import type { JSX } from "solid-js";
import { Match, Switch, lazy } from "solid-js";
import { Navigate } from "solid-start";
import { useUser } from "~/providers/userProvider";

type Props = {
  role: "isProspect" | "isReference" | "isVendor";
  children: JSX.Element | JSX.Element[];
};

const LoginWithEmail = lazy(() => import("~/routes/login-with-email"));

export default function AuthGuard(props: Props) {
  const { user } = useUser();

  return (
    <Switch fallback={<LoginWithEmail />}>
      <Match when={user?.[props.role]}>
        {props.children}
      </Match>
      <Match when={user}>
        <Navigate href="/" />
      </Match>
    </Switch>
  );
}
