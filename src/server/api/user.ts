import server$ from "solid-start/server";
import { createResource } from "solid-js";
import { useServerContext } from 'solid-start';
import { getOrElseW } from 'fp-ts/lib/Either';
import { authorizer$, getTokens } from '../cognito/authorizer';

export const getMe$ = () =>
  createResource(
    server$(async () => {
      const server = useServerContext();
      const tokens = getTokens(server.request.headers.get("cookie"));
      const res = await authorizer$(tokens)();
      const user = getOrElseW(() => undefined)(res);
      
      return user;
    }),
    { deferStream: false }
  );