import { eq } from "drizzle-orm";
import { db } from "../db";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";

export const getByIdWithRolesAndAvatar = (authenticatedUserId: string) =>
  db.query.authenticatedUsers.findFirst({
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
  });
