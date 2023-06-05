import { authorizer$, getAccessToken } from "../cognito/authorizer";
import { getByIdWithRolesAndAvatar } from "../services/authenticatedUser";
import { withAuthUserId } from "../utils/response";
import server$ from "solid-start/server";
import { createResource } from "solid-js";
import { useServerContext } from 'solid-start';
import { getOrElseW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { chain } from 'fp-ts/lib/TaskEither';

export const getMe$ = () =>
  createResource(
    server$(async () => {
      const server = useServerContext();
      const token = getAccessToken(server.request.headers.get("cookie"));
      const res = pipe(
        token,
        chain(authorizer$),
        chain(withAuthUserId(getByIdWithRolesAndAvatar))
      );

      return getOrElseW(() => undefined)(await res());
    }),
    { deferStream: true }
  );

// export const getMe = query$({
//   key: "getMe",
//   middlewares: [authorizer],
//   queryFn: ({ ctx$ }) => {
//     return pipe(ctx$, withAuthUserId(getByIdWithRolesAndAvatar));
//   },
// });
