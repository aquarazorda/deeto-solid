import { parse } from "cookie";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
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
import { middleware$ } from "@prpc/solid";

export const findByCognitoId = (cognitoUserId: string) =>
  pipe(
    TE.tryCatch(
      () =>
        db.query.userAccounts.findFirst({
          where: eq(userAccounts.cognitoId, cognitoUserId),
        }),
      () => ErrorsEnum.COGNITO_USER_NOT_FOUND
    ),
    TE.chainEitherK(E.fromNullable(ErrorsEnum.COGNITO_USER_NOT_FOUND))
  );

export const queryUserAccount = (authenticatedUserId: string) =>
  pipe(
    TE.tryCatch(
      () =>
        db.query.userAccounts.findFirst({
          where: eq(userAccounts.authenticatedUserId, authenticatedUserId),
        }),
      () => ErrorsEnum.USER_DONT_EXITS
    ),
    TE.chainEitherK(E.fromNullable(ErrorsEnum.USER_DONT_EXITS))
  );

export const queryUserAccountWithAuthenticatedUserId = (
  authenticatedUserId: string
) =>
  pipe(
    TE.tryCatch(
      () =>
        db.query.userAccounts.findFirst({
          where: eq(userAccounts.authenticatedUserId, authenticatedUserId),
        }),
      () => ErrorsEnum.USER_DONT_EXITS
    ),
    TE.chainEitherK(E.fromNullable(ErrorsEnum.USER_DONT_EXITS))
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

const refreshTokenFlow = (refreshTokenFull: E.Right<string>) => {
  const { refreshToken, originalAuthenticatedUserId } = splitRefreshToken(
    refreshTokenFull.right
  );

  return pipe(
    queryUserAccountWithAuthenticatedUserId(originalAuthenticatedUserId),
    TE.bindTo("originalAuthenticatedUser"),
    TE.bind("userToRefresh", ({ originalAuthenticatedUser }) =>
      getByIdWithRolesAndAvatar(originalAuthenticatedUser.authenticatedUserId)
    ),
    TE.tap(() =>
      initiateCustomAuth({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      })
    ),
    TE.bind("tokens", ({ userToRefresh }) => loginPasswordLess(userToRefresh)),
    TE.chain(({ userToRefresh, tokens }) =>
      TE.right({
        refreshToken: tokens.RefreshToken,
        accessToken: tokens.AccessToken,
        ...userToRefresh,
      })
    )
  );
};

const accessTokenFlow = (tokens: {
  accessToken: E.Either<ErrorsEnum, string>;
  refreshToken: E.Either<ErrorsEnum, string>;
}) =>
  pipe(
    decodeToken(tokens.accessToken),
    TE.fold(
      (err) => {
        if (err === ErrorsEnum.UNAUTHORIZED && E.isRight(tokens.refreshToken)) {
          return refreshTokenFlow(tokens.refreshToken);
        }
        return TE.left(err);
      },
      flow(
        getUserWithCognito,
        TE.chain(({ authenticatedUserId }) =>
          getByIdWithRolesAndAvatar(authenticatedUserId)
        ),
        TE.chainEitherK((user) =>
          E.right({
            ...user,
            accessToken: E.getOrElseW(() => undefined)(tokens.accessToken),
            refreshToken: E.getOrElseW(() => undefined)(tokens.refreshToken),
          })
        )
      )
    )
  );

export const authorizer$ = (tokens: ReturnType<typeof getTokens>) => {
  if (E.isRight(tokens.accessToken)) {
    return accessTokenFlow({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  if (E.isRight(tokens.refreshToken)) {
    return refreshTokenFlow(tokens.refreshToken);
  }

  return TE.left(ErrorsEnum.UNAUTHORIZED);
};

export const getTokens = (cookie: string | null) =>
  pipe(parse(cookie || ""), (cookies) => ({
    refreshToken: isEmpty(cookies["refreshToken"] ?? "")
      ? E.left(ErrorsEnum.MISSING_REFRESH_TOKEN)
      : E.right(cookies["refreshToken"]),
    accessToken: isEmpty(cookies["accessToken"] ?? "")
      ? E.left(ErrorsEnum.MISSING_REFRESH_TOKEN)
      : E.right(cookies["accessToken"]),
  }));

const getAccessTokenFromCookie = (cookie: string | null) =>
  pipe(parse(cookie || ""), (cookies) =>
    isEmpty(cookies["accessToken"] ?? "")
      ? E.left(ErrorsEnum.MISSING_ACCESS_TOKEN)
      : E.right(cookies["accessToken"] as string)
  );

export type AuthMiddlewareResponse = Awaited<ReturnType<typeof authMiddleware>>;

export const authMiddleware = middleware$(
  async ({ request$ }) => {
    const user = await pipe(
      getAccessTokenFromCookie(request$.headers.get("cookie")),
      decodeToken,
      TE.chain(getUserWithCognito)
    )();

    return user;
  }
);
