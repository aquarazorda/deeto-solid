import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { authenticatedUsers } from "./authenticatedUsers";
import { relations } from 'drizzle-orm';
import { UserPrivilegeEnum } from '~/server/enums/userPrivileges';

const userPrivilegesEnum = pgEnum("userPrivileges", Object.values(UserPrivilegeEnum) as [string, ...string[]]);

export const authenticatedUserPrivileges = pgTable(
  "AuthenticatedUserPrivileges",
  {
    privilegeId: uuid("privilegeId").primaryKey(),
    authenticatedUserId: uuid("authenticatedUserId")
      .notNull()
      .references(() => authenticatedUsers.authenticatedUserId),
    userPrivileges: userPrivilegesEnum('userPrivileges').notNull()
  }
);

export const authenticatedUserPrivilegeRelations = relations(authenticatedUserPrivileges, ({ one }) => ({
  authenticatedUser: one(authenticatedUsers, {
      fields: [authenticatedUserPrivileges.authenticatedUserId],
      references: [authenticatedUsers.authenticatedUserId],
  }),
}));
