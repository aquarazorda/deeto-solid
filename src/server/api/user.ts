import { authorizer$, getAccessToken } from "../cognito/authorizer";
import { getByIdWithRolesAndAvatar } from "../services/authenticatedUser";
import { withAuthUserId } from "../utils/response";
import server$ from "solid-start/server";
import { createResource } from "solid-js";
import { useServerContext } from 'solid-start';
import { getOrElseW } from 'fp-ts/lib/Either';

export const getMe$ = () =>
  createResource(
    server$(async () => {
      const server = useServerContext();
      const token = getAccessToken(server.request.headers.get("cookie"));
      
      const res = await authorizer$(token);
      const userE = await withAuthUserId(getByIdWithRolesAndAvatar)(res);

      return getOrElseW(() => undefined)(userE);
    })
  );

// export const getMe = query$({
//   key: "getMe",
//   middlewares: [authorizer],
//   queryFn: ({ ctx$ }) => {
//     return pipe(ctx$, withAuthUserId(getByIdWithRolesAndAvatar));
//   },
// });
