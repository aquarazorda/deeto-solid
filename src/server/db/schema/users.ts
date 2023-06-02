import { pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";

export const userAccounts = pgTable("UserAccounts", {
  userAccountId: uuid('userAccountId').primaryKey(),
  authenticatedUserId: uuid('authenticatedUserId').notNull(),
  vendorId: uuid('vendorId').notNull(),
  username: varchar("username", { length: 255 }),
  password: text("password"),
  schemaName: varchar("schemaName", { length: 255 }),
  cognitoId: uuid("cognitoId").notNull(),
});
