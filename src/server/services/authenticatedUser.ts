import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import {
  chain,
  fromNullable,
  chainEitherK,
  tryCatch,
} from "fp-ts/lib/TaskEither";
import type { TokenPayload } from "../cognito/token";
import { pipe } from "fp-ts/lib/function";
import { ErrorsEnum } from "../enums/errors";
import { UserStatusEnum } from "../enums/userStatus";
import { left, right } from "fp-ts/lib/Either";

export const getUserWithCognito = (tokenPayload: TokenPayload) => {
  const query = db.query.authenticatedUsers
    .findFirst({
      where: and(
        eq(
          authenticatedUsers.authenticatedUserId,
          tokenPayload?.authenticatedUserId
        ),
        eq(authenticatedUsers.cognitoUserId, tokenPayload.cognitoId)
      ),
      with: {
        vendorContact: true
      }
    });

  return pipe(
    tryCatch(() => query, () => ErrorsEnum.USER_DONT_EXITS),
    chain(fromNullable(ErrorsEnum.USER_DONT_EXITS))
  );
};

export const getByIdWithRolesAndAvatar = (authenticatedUserId: string) => {
  const query = db.query.authenticatedUsers
    .findFirst({
      where: eq(authenticatedUsers.authenticatedUserId, authenticatedUserId),
      with: {
        authenticatedUserPrivileges: true,
        avatar: true,
        accountContacts: {
          with: {
            account: true,
          },
        },
      },
    })
    .then((user) => {
      if (!user) {
        throw new Error(`User not found`);
      }

      const { authenticatedUserPrivileges, ...rest } = user;
      const userPrivileges = authenticatedUserPrivileges.map(
        ({ userPrivileges }) => userPrivileges
      );

      return {
        ...rest,
        userPrivileges,
        isVendor: userPrivileges.includes("vendor"),
        isProspect: userPrivileges.includes("prospect"),
        isReference: userPrivileges.includes("reference"),
      };
    });

  return tryCatch(() => query, () => ErrorsEnum.USER_DONT_EXITS);
};

export const getAuthenticatedUserById = (authenticatedUserId: string) =>
  pipe(
    tryCatch(
      () =>
        db.query.authenticatedUsers.findFirst({
          where: eq(
            authenticatedUsers.authenticatedUserId,
            authenticatedUserId
          ),
        }),
      () => ErrorsEnum.USER_DONT_EXITS
    ),
    chain(fromNullable(ErrorsEnum.USER_DONT_EXITS)),
    chainEitherK((user) => user.userStatus === UserStatusEnum.LOCKED ? left(ErrorsEnum.USER_LOCKED) : right(user))
  );
