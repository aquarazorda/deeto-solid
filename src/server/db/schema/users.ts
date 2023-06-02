import { varchar, uuid, pgSchema } from "drizzle-orm/pg-core";

const deetoroutingSchema = pgSchema("deetorouting");

export const userAccounts = deetoroutingSchema.table("UserAccounts", {
  userAccountId: uuid('userAccountId').primaryKey(),
  authenticatedUserId: uuid('authenticatedUserId').notNull(),
  vendorId: uuid('vendorId').notNull(),
  cognitoId: uuid("cognitoId").notNull(),
  schemaName: varchar("schemaName", { length: 255 }),
});
