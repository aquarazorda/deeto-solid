import type { TaskEither} from 'fp-ts/lib/TaskEither';
import { fromEither, chain } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import type { AuthorizerResponse } from '../cognito/authorizer';
import { map } from 'fp-ts/lib/Either';

export const withAuthUserId = <T>(fn: (id: string) => TaskEither<string, T>) => (ctx$: AuthorizerResponse) => pipe(
  ctx$,
  map((ctx) => ctx.authenticatedUserId),
  fromEither,
  chain(fn)
)()