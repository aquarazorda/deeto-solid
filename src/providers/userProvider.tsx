import type { JSX, ResourceActions } from "solid-js";
import { Suspense, createContext, useContext } from "solid-js";
import { getMe$ } from "~/server/api/user";
import type { getByIdWithRolesAndAvatar } from "~/server/services/authenticatedUser";
import type { ExtractFromTE } from "~/types/utils";

type User = ExtractFromTE<ReturnType<typeof getByIdWithRolesAndAvatar>>;

type UserContext = ResourceActions<User | undefined> & {
  user?: User;
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

  return (
    <UserContext.Provider
      value={{
        refetch,
        mutate,
        user: res(),
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
