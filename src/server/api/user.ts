import { authorizer$, getTokens } from "../cognito/authorizer";
import server$ from "solid-start/server";
import { createResource } from "solid-js";
import { useServerContext } from 'solid-start';
import { getOrElseW } from 'fp-ts/lib/Either';
import { useMagicLink } from '../services/link';

export const getMe$ = () =>
  createResource(
    server$(async () => {
      const server = useServerContext();
      const url = new URL(server.request.url);
      const searchParams = new URLSearchParams(url.search);
      const ml = searchParams.get("ml");
      const tokens = getTokens(server.request.headers.get("cookie"));
      const res = await (ml ? useMagicLink(ml) : authorizer$(tokens))();
    
      const user = getOrElseW(() => undefined)(res);

      return user;
    }),
    { deferStream: false }
  );