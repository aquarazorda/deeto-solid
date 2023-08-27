import { FullPageSpinner } from "~/components/loaders/Spinner";
import { Suspense, createEffect } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { Navigate, useRouteData, useSearchParams } from "solid-start";
import { useMagicLink } from "~/server/services/link";
import { isRight, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { chainEitherK } from "fp-ts/lib/TaskEither";
import { ShowEither } from '~/components/fp-ts/ShowEither';
import { setCookie } from '~/env/utils';

export const routeData = () => {
  const [search] = useSearchParams();

  return createServerData$((id: string) => pipe(
    useMagicLink(id),
    chainEitherK(({ accessToken, refreshToken }) =>
      right({
        accessToken,
        refreshToken,
      })
    )
  )(), {
    key: () => search.id
  });
};

export default function MagicLinkPage() {
  const data = useRouteData<typeof routeData>();

  createEffect(() => {
    const res = data();
    if(res && isRight(res)) {
      setCookie('accessToken', res.right.accessToken);
      setCookie('refreshToken', res.right.refreshToken);
    };
  });

  return <Suspense fallback={<FullPageSpinner />}>
    <ShowEither either={data()}>
      {() => <Navigate href={'/'} />}
    </ShowEither>
  </Suspense>;
}
