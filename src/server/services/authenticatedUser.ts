import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import { tryCatch } from "fp-ts/lib/TaskEither";
import type { TokenPayload } from "../cognito/token";

export const getUserWithCognito = (tokenPayload: TokenPayload) => {
  const query = db.query.authenticatedUsers
  .findFirst({
    where: and(
      eq(
        authenticatedUsers.authenticatedUserId,
        tokenPayload?.authenticatedUserId
      ),
      eq(authenticatedUsers.cognitoUserId, tokenPayload.sub)
    ),
  })
  // TODO
  // include: [{ model: AccountContact, include: [{ model: Account }] }, { model: VendorContact }],
  .then((user) => ({
    user,
    tokenPayload,
  }));

  return tryCatch(() => query, String);
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

      return user;
    });

  return tryCatch(() => query, String);
};
