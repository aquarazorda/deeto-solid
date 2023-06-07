import type { Accessor, JSX, ResourceActions } from "solid-js";
import { createContext, createEffect, createMemo, on, useContext } from "solid-js";
import { useSearchParams } from "solid-start";
import { setCookie } from "~/env/utils";
import { getMe$ } from "~/server/api/user";
import type { getByIdWithRolesAndAvatar } from "~/server/services/authenticatedUser";
import type { ExtractFromTE } from "~/types/utils";

type User = ExtractFromTE<ReturnType<typeof getByIdWithRolesAndAvatar>>;

type UserContext = ResourceActions<User | undefined> & {
  user?: User;
  isLoaded: Accessor<boolean>;
};

const UserContext = createContext<UserContext>({
  refetch: () => {},
  mutate: () => {},
} as UserContext);

export const useUser = () => useContext(UserContext);

type Props = {
  children: JSX.Element | JSX.Element[];
};

export default function UserProvider(props: Props) {
  const [res, { refetch, mutate }] = getMe$();
  const [search, setSearch] = useSearchParams();
  const isLoaded = createMemo(() => !res.loading);

  createEffect(
    on(res, () => {
      setCookie("accessToken", res()?.accessToken);
      setCookie("refreshToken", res()?.refreshToken);
      setSearch({
        ...search,
        ml: undefined,
      });
    })
  );

  return (
    <UserContext.Provider
      value={{
        refetch,
        mutate,
        user: res(),
        isLoaded
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
