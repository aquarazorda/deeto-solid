import { parse } from "cookie";
import type { Either, Right } from "fp-ts/lib/Either";
import {
  fromNullable,
  getOrElseW,
  isRight,
  left,
  right,
} from "fp-ts/lib/Either";
import {
  bind,
  bindTo,
  fold,
  tap,
  tryCatch,
  left as leftTE,
  right as rightTE,
} from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import { chain, chainEitherK } from "fp-ts/lib/TaskEither";
import type { TokenPayload } from "./token";
import { decodeToken } from "./token";
import {
  getByIdWithRolesAndAvatar,
  getUserWithCognito,
} from "../services/authenticatedUser";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { ErrorsEnum } from "../enums/errors";
import { userAccounts } from "../db/schema/users";
import {
  REFRESH_TOKEN_SEPARATOR,
  REFRESH_TOKEN_SEPARATOR_ENCODED,
} from "../utils/constants";
import { initiateCustomAuth, loginPasswordLess } from "../services/cognito";
import { isEmpty } from "fp-ts/lib/string";

export type AuthorizerResponse = Either<string, TokenPayload>;

export const findByCognitoId = (cognitoUserId: string) =>
  pipe(
    tryCatch(
      () =>
        db.query.userAccounts.findFirst({
          where: eq(userAccounts.cognitoId, cognitoUserId),
        }),
      () => ErrorsEnum.COGNITO_USER_NOT_FOUND
    ),
    chainEitherK(fromNullable(ErrorsEnum.COGNITO_USER_NOT_FOUND))
  );

export const queryUserAccount = (userAccountId: string) =>
  pipe(
    tryCatch(
      () =>
        db.query.userAccounts.findFirst({
          where: eq(userAccounts.userAccountId, userAccountId),
        }),
      () => ErrorsEnum.USER_DONT_EXITS
    ),
    chainEitherK(fromNullable(ErrorsEnum.USER_DONT_EXITS))
  );

  export const queryUserAccountWithAuthenticatedUserId = (authenticatedUserId: string) =>
  pipe(
    tryCatch(
      () =>
        db.query.userAccounts.findFirst({
          where: eq(userAccounts.authenticatedUserId, authenticatedUserId),
        }),
      () => ErrorsEnum.USER_DONT_EXITS
    ),
    chainEitherK(fromNullable(ErrorsEnum.USER_DONT_EXITS))
  );

const splitRefreshToken = (refreshTokenWithVendor: string) => {
  if (refreshTokenWithVendor.includes(REFRESH_TOKEN_SEPARATOR_ENCODED)) {
    return {
      refreshToken: refreshTokenWithVendor.split(
        REFRESH_TOKEN_SEPARATOR_ENCODED
      )[0],
      originalAuthenticatedUserId: refreshTokenWithVendor.split(
        REFRESH_TOKEN_SEPARATOR_ENCODED
      )[1],
    };
  }
  return {
    refreshToken: refreshTokenWithVendor.split(REFRESH_TOKEN_SEPARATOR)[0],
    originalAuthenticatedUserId: refreshTokenWithVendor.split(
      REFRESH_TOKEN_SEPARATOR
    )[1],
  };
};

const refreshTokenFlow = (refreshTokenFull: Right<string>) => {
  const { refreshToken, originalAuthenticatedUserId } = splitRefreshToken(
    refreshTokenFull.right
  );

  return pipe(
    queryUserAccountWithAuthenticatedUserId(originalAuthenticatedUserId),
    bindTo("originalAuthenticatedUser"),
    bind("userToRefresh", ({ originalAuthenticatedUser }) =>
      getByIdWithRolesAndAvatar(originalAuthenticatedUser.authenticatedUserId)
    ),
    tap(() =>
      initiateCustomAuth({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      })
    ),
    bind("tokens", ({ userToRefresh }) => loginPasswordLess(userToRefresh)),
    chain(({ userToRefresh, tokens }) =>
      rightTE({
        refreshToken: tokens.RefreshToken,
        accessToken: tokens.AccessToken,
        ...userToRefresh,
      })
    )
  );
};

const accessTokenFlow = (tokens: {
  accessToken: Right<string>;
  refreshToken: Either<ErrorsEnum, string>;
}) =>
  pipe(
    decodeToken(tokens.accessToken),
    fold(
      (err) => {
        if (err === ErrorsEnum.UNAUTHORIZED && isRight(tokens.refreshToken)) {
          return refreshTokenFlow(tokens.refreshToken);
        }
        return leftTE(err);
      },
      flow(
        getUserWithCognito,
        chain(({ authenticatedUserId }) =>
          getByIdWithRolesAndAvatar(authenticatedUserId)
        ),
        chainEitherK((user) =>
          right({
            ...user,
            accessToken: tokens.accessToken.right,
            refreshToken: getOrElseW(() => undefined)(tokens.refreshToken),
          })
        )
      )
    )
  );

export const authorizer$ = (tokens: ReturnType<typeof getTokens>) => {
  if (isRight(tokens.accessToken)) {
    return accessTokenFlow({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  if (isRight(tokens.refreshToken)) {
    return refreshTokenFlow(tokens.refreshToken);
  }

  return leftTE(ErrorsEnum.UNAUTHORIZED);
};

export const getTokens = (cookie: string | null) =>
  pipe(parse(cookie || ""), (cookies) => ({
    refreshToken: isEmpty(cookies["refreshToken"] ?? '')
      ? left(ErrorsEnum.MISSING_REFRESH_TOKEN)
      : right(cookies["refreshToken"]),
    accessToken: isEmpty(cookies["accessToken"] ?? '')
      ? left(ErrorsEnum.MISSING_REFRESH_TOKEN)
      : right(cookies["accessToken"]),
  }));

// const authorizer = middleware$(
//   async ({ request$ }): Promise<AuthorizerResponse> => {
//     return pipe(
//       getTokens(request$.headers.get("cookie")),
//       chain(decodeToken),
//       chain(getUserWithCognito),
//       chainEitherK(({ user, tokenPayload }) =>
//         !user || user.userStatus === UserStatusEnum.LOCKED
//           ? left("User not found or locked")
//           : right(tokenPayload)
//       )
//     )();

//     // TODO
//     // if (user?.vendorContact?.vendorContactId) {
//     //   requestContext.vendorContactId = user?.vendorContact?.vendorContactId;
//     // }

//     // Authorizer response context values must be of type string, number, or boolean
//     // const accountContactIds = user?.accountContacts?.map(
//     //   (el) => el.accountContactId
//     // );
//     // if (accountContactIds?.length) {
//     //   requestContext.accountContactIds = JSON.stringify(accountContactIds);
//     // }
//   }
// );

// export default authorizer;
