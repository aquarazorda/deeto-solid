import { left } from 'fp-ts/lib/Either';
import { For, Suspense, createResource } from "solid-js";
import { useRouteData } from "solid-start";
import { ShowEither } from "~/components/fp-ts/ShowEither";
import { getReferenceDashboard } from "~/server/api/vendor";
import { ErrorsEnum } from '~/server/enums/errors';

export const routeData = () => {
  const [data] = createResource(getReferenceDashboard, {
    initialValue: left(ErrorsEnum.INTERNAL_SERVER_ERROR)
  });
  return data;
};

export default function VendorDashboard() {
  const data = useRouteData<typeof routeData>();

  return (
    <Suspense fallback={"It's loading"}>
      <ShowEither either={data()}>
        {(data) => (
          <For each={data}>
            {(item) => <div>{item.AuthenticatedUsers.firstName}</div>}
          </For>
        )}
      </ShowEither>
    </Suspense>
  );
}
