import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { UserStatusEnum } from "~/server/enums/userStatus";

export const authenticatedUsers = pgTable("AuthenticatedUsers", {
  authenticatedUserId: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  userStatus: text("text", { enum: Object.values(UserStatusEnum) as [string, ...string[]] }).notNull(),
});

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
