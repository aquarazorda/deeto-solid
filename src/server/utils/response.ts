import type { TaskEither } from "fp-ts/lib/TaskEither";
import type { TokenPayload } from "../cognito/token";

export const withAuthUserId =
  <T>(fn: (id: string) => TaskEither<string, T>) =>
  (payload: TokenPayload) =>
    fn(payload.authenticatedUserId);
