import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { authenticatedUsers } from "./authenticatedUsers";
import { accountSchema } from './account';

export const accountContactSchema = pgTable("AccountContacts", {
  accountContactId: uuid("accountContactId").primaryKey(),
  title: varchar("title", { length: 255 }),
  publicNote: varchar("publicNote", { length: 900 }),
  publicNoteAiResults: varchar("publicNoteAiResults", { length: 255 }),
  publicNoteUserInput: varchar("publicNoteUserInput", { length: 4096 }),
  selectedReviewQuote: varchar("selectedReviewQuote", { length: 255 }),
  often: varchar("often", { length: 255 }),
  linkedInProfile: varchar("linkedInProfile", { length: 255 }),
  frequency: integer("frequency"),
  redeemableAmount: integer("redeemableAmount").notNull().default(0),
  authenticatedUserId: uuid("authenticatedUserId").notNull().references(
    () => authenticatedUsers.authenticatedUserId
  ),
  accountId: uuid("accountId").notNull().references(() => accountSchema.accountId)
});


// TODO: add relations

export const accountContactRelations = relations(
  accountContactSchema,
  ({ one }) => ({
    authenticatedUser: one(authenticatedUsers, {
      fields: [accountContactSchema.authenticatedUserId],
      references: [authenticatedUsers.authenticatedUserId],
    }),
    account: one(accountSchema, {
      fields: [accountContactSchema.accountId],
      references: [accountSchema.accountId],
    })
  })
);

//   @HasMany(() => InfoTab, 'accountContactId')
//   infoTab: InfoTab[];

//   @HasMany(() => Redemption, 'accountContactId')
//   redemption: Redemption;

//   @HasMany(() => ZoomVisitor, 'accountContactId')
//   zoomVisits: ZoomVisitor[];

//   @HasMany(() => Opportunity, 'accountContactId')
//   opportunities: Opportunity[];

//   @HasMany(() => RecommendedReference, 'referenceId')
//   recommendedReferences: RecommendedReference[];

//   @HasMany(() => MeetingFeedback, 'reviewerId')
//   meetingFeedbacks: MeetingFeedback[];

//   @HasMany(() => Meeting, 'referenceContactId')
//   referenceMeetings: Meeting[];

//   @HasMany(() => Meeting, 'prospectContactId')
//   prospectMeetings: Meeting[];

//   @HasMany(() => Attention, 'accountContactId')
//   attentions: Attention[];

//   @HasMany(() => DismissedAttention, 'accountContactId')
//   dismissedAttentions: DismissedAttention[];

//   @HasMany(() => AccountContactMeetingAvailability, 'accountContactId')
//   meetingAvailabilities: AccountContactMeetingAvailability[];

//   @ForeignKey(() => VendorContact)
//   @Column({
//     type: DataType.UUID,
//   })
//   adminId: string;

//   @BelongsTo(() => VendorContact)
//   admin: VendorContact;

//   @BelongsTo(() => AuthenticatedUser)
//   authenticatedUser: AuthenticatedUser;

//   @AllowNull(false)
//   @ForeignKey(() => Account)
//   @Column({
//     type: DataType.UUID,
//   })
//   accountId: string;

//   @BelongsTo(() => Account)
//   account: Account;

//   @BelongsToMany(() => CustomizedFormValue, () => AccountContactToCustomizedFormValues)
//   customizedFormValues: CustomizedFormValue[];

//   @BelongsToMany(() => Notification, () => NotificationAccountContact)
//   notifications: Notification[];

//   @BeforeCreate
//   static addUuidId(instance: AccountContact): void {
//     instance.accountContactId = uuidv4();
//   }
// }
