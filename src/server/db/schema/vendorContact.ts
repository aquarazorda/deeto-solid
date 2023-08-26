import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { accountContactSchema } from './accountContact';
import { authenticatedUsers } from './authenticatedUsers';
import { vendorSchema } from './vendor';

export const vendorContactSchema = pgTable('VendorContacts', {
  vendorContactId: uuid('vendorContactId').primaryKey(),
  sendEmailOnBehalf: boolean('sendEmailOnBehalf'),
  title: text('title'),
  // salesforceVendorToken
  authenticatedUserId: uuid('authenticatedUserId').references(() => authenticatedUsers.authenticatedUserId),
  vendorId: uuid('vendorId').notNull().references(() => vendorSchema.vendorId),
})

export const vendorContactRelations = relations(vendorContactSchema, ({ one, many }) => ({
  accountContacts: many(accountContactSchema),
  authenticatedUser: one(authenticatedUsers, {
    fields: [vendorContactSchema.authenticatedUserId],
    references: [authenticatedUsers.authenticatedUserId],
  }),
  vendor: one(vendorSchema, {
    fields: [vendorContactSchema.vendorId],
    references: [vendorSchema.vendorId],
  })
}));