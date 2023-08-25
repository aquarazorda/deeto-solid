import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { vendorAccountLevelEnumPg } from '~/server/enums/vendor';
import { accountSchema } from './account';
import { vendorContactSchema } from './vendorContact';

//   @HasOne(() => StatisticsDashboard, 'vendorId')
//   statisticsDashboard: StatisticsDashboard;

//   @HasMany(() => VendorContact, 'vendorId')
//   vendorContacts: VendorContact[];

//   @ForeignKey(() => Avatar)
//   @Column({
//     type: DataType.UUID,
//   })
//   avatarId: string;

//   @BelongsTo(() => Avatar)
//   avatar: Avatar;

//   @ForeignKey(() => Avatar)
//   @Column({
//     type: DataType.UUID,
//   })
//   appLogoId: string;

//   @BelongsTo(() => Avatar, 'appLogoId')
//   appLogo: Avatar;

//   @HasOne(() => VendorSettings, 'vendorId')
//   settings: VendorSettings;

//   @HasMany(() => Account, 'vendorId')
//   accounts: Account[];
// }

// todo add relations
export const vendorSchema = pgTable('Vendors', {
  vendorId: uuid('vendorId').primaryKey(),
  name: varchar('name', { length: 255 }),
  salesforceApiKey: varchar('salesforceApiKey', { length: 255 }),
  accountLevel: vendorAccountLevelEnumPg('accountLevel'),
  sendEmailOnBehalf: boolean('sendEmailOnBehalf'),
  activationDate: timestamp('activationDate'),
  defaultCreditAmountPerMeeting: integer('defaultCreditAmountPerMeeting'),
})

export const vendorRelations = relations(vendorSchema, ({ many }) => ({
  accounts: many(accountSchema),
  vendorContacts: many(vendorContactSchema),
}))