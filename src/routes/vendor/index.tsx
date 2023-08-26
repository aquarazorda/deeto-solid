import { For, Suspense } from "solid-js";
import { useRouteData } from "solid-start";
import { ShowEither } from "~/components/fp-ts/ShowEither";
import { getReferenceDashboard } from "~/server/api/vendor";

export const routeData = () => {
  const dashboard = getReferenceDashboard();
  return { dashboard };
};

export default function VendorDashboard() {
  const data = useRouteData<typeof routeData>();

  return (
    <Suspense fallback={"It's loading"}>
      <ShowEither either={data.dashboard.data}>
        {(data) => (
          <For each={data}>
            {(item) => <div>{item.AuthenticatedUsers.firstName}</div>}
          </For>
        )}
      </ShowEither>
    </Suspense>
  );
}
