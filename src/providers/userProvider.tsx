import { getOrElseW } from "fp-ts/lib/Either";
import type { Accessor, JSX } from "solid-js";
import { createContext, createMemo, useContext } from "solid-js";
import { getMe } from "~/server/api/user";
import type { getByIdWithRolesAndAvatar } from "~/server/services/authenticatedUser";
import type { ExtractFromTE } from '~/types/utils';

type User = ExtractFromTE<ReturnType<typeof getByIdWithRolesAndAvatar>>;

const UserContext = createContext<Accessor<User | undefined>>(() => undefined);

export const useUser = () => useContext(UserContext);

type Props = {
  children: JSX.Element | JSX.Element[];
};

export default function UserProvider(props: Props) {
  const res = getMe(undefined, () => ({
    retry: false,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
    suspense: true,
    deferStream: true,
  }));

  const user = createMemo(() =>
    res.isSuccess && res.data
      ? getOrElseW(() => undefined)(res.data)
      : undefined
  );

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
}
