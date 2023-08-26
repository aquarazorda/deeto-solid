import type { Either} from 'fp-ts/lib/Either';
import { isRight } from 'fp-ts/lib/Either'
import type { JSX} from 'solid-js';
import { Show } from 'solid-js';

type Props<T> = {
  either: Either<unknown, T> | undefined;
  children: (val: T) => JSX.Element | JSX.Element[];
}

export const ShowEither = <T,>(props: Props<T>) => {
  return <Show when={props.either && isRight(props.either)}>
    {props.children((props.either as { right: T }).right)}
  </Show>
}