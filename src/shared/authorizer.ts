import { chain } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { useServerContext } from "solid-start";
import server$ from "solid-start/server";
import type { AuthMiddlewareInput } from "~/server/cognito/authorizer";
import { getUserWithCookies } from "~/server/cognito/authorizer";

export const withAuth$ = <T>(fn: AuthMiddlewareInput<T>) =>
  server$((fn: AuthMiddlewareInput<T>) => {
    const serverContext = useServerContext();

    return pipe(
      getUserWithCookies(serverContext.request.headers.get("cookie")),
      chain(fn)
    )();
  })(fn);
