import { eq } from "drizzle-orm";
import { db } from "../db";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import { tryCatch } from 'fp-ts/lib/TaskEither';

export const getByIdWithRolesAndAvatar = (authenticatedUserId: string) => {
  const query = db.query.authenticatedUsers.findFirst({
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
  }).then((user) => {
    if (!user) {
      throw new Error(`User not found`);
    }

    return user;
  });
  
  return tryCatch(() => query, String);
}