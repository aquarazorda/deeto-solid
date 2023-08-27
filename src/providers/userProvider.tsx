import type { Accessor, JSX, ResourceActions } from "solid-js";
import { createContext, createMemo, useContext } from "solid-js";
import { getMe$ } from "~/server/api/user";
import type { authorizer$ } from '~/server/cognito/authorizer';
import type { ExtractFromTE } from "~/types/utils";

type User = ExtractFromTE<ReturnType<typeof authorizer$>>;

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
  const isLoaded = createMemo(() => !res.loading);

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
