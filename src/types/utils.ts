import type { TaskEither } from 'fp-ts/lib/TaskEither';

export type ExtractFromTE<T> = T extends TaskEither<infer _, infer A> ? A : never;