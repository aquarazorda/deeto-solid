import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { vendorSchema } from './vendor';
import { relations } from 'drizzle-orm';
import { accountContactSchema } from './accountContact';

// @Column({
//   type: DataType.STRING,
// })
// salesforceAccountId: string;

// @ForeignKey(() => Vendor)
// @Column({
//   type: DataType.UUID,
// })
// vendorId: string;

// @BelongsTo(() => Vendor)
// vendor: Vendor;

// @HasMany(() => Opportunity, 'accountId')
// opportunities: Opportunity[];

// @HasMany(() => AccountContact, 'accountId')
// accountContacts: AccountContact[];

// @HasMany(() => Meeting, 'referenceAccountId')
// meetings: Meeting[];

export const accountSchema = pgTable('Accounts', {
  accountId: uuid('accountId').primaryKey(),
  companyName: varchar('companyName', { length: 255 }),
  linkedInProfile: varchar('linkedInProfile', { length: 255 }),
  salesforceAccountId: varchar('salesforceAccountId', { length: 255 }),
  vendorId: uuid('vendorId').notNull().references(() => vendorSchema.vendorId),
});

export const accountRelations = relations(accountSchema, ({ many }) => ({
  accountContacts: many(accountContactSchema),
}))