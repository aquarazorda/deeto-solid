import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const userAccounts = pgTable("UserAccounts", {
  userAccountId: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }),
  password: text("password"),
  schemaName: varchar("schemaName", { length: 255 }),
  cognitoId: varchar("cognitoId", { length: 255 }),
});
