import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { UserStatusEnum, userStatusEnumPg } from "~/server/enums/userStatus";
import { authenticatedUserPrivileges } from "./authenticatedUserPrivileges";
import { avatarSchema } from "./avatar";
import { accountContactSchema } from "./accountContact";
import { vendorContactSchema } from './vendorContact';

export const authenticatedUsers = pgTable("AuthenticatedUsers", {
  authenticatedUserId: uuid("authenticatedUserId").primaryKey(),
  cognitoUserId: uuid("cognitoUserId").notNull(),
  username: varchar("username", { length: 255 }),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  approvedEULA: boolean("approvedEULA").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  userStatus: userStatusEnumPg("userStatus")
    .default(UserStatusEnum.PENDING)
    .notNull(),
  avatarId: uuid("avatarId").references(() => avatarSchema.avatarId),
  preferredTimezone: varchar("preferredTimezone", { length: 255 }),
  preferredUTCOffset: integer("prefferedUTCOffset"),
  beforeLockedUserStatus: userStatusEnumPg("beforeLockedUserStatus"),
  salesforceId: varchar("salesforceId", { length: 255 }),
  userSelectedTimeZone: varchar("userSelectedTimeZone", { length: 255 }),
});

export const authenticatedUsersRelations = relations(
  authenticatedUsers,
  ({ one, many }) => ({
    authenticatedUserPrivileges: many(authenticatedUserPrivileges),
    avatar: one(avatarSchema, {
      fields: [authenticatedUsers.avatarId],
      references: [avatarSchema.avatarId],
    }),
    accountContacts: many(accountContactSchema),
    vendorContact: one(vendorContactSchema, {
      fields: [authenticatedUsers.authenticatedUserId],
      references: [vendorContactSchema.authenticatedUserId],
    })
  })
);

// model AuthenticatedUser {
//   authenticatedUserId String @id @default(uuid())
//   email String @unique
//   password String
//   firstName String
//   lastName String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   avatarId String?
//   avatar Avatar? @relation(fields: [avatarId], references: [avatarId])

//   vendorContact VendorContact?
//   notifications Notification[]
//   authenticatedUserPrivileges AuthenticatedUserPrivilege[]
//   accountContacts AccountContact[]

//   guiSettings GuiSettings?
// }
