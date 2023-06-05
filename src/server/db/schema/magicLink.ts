import { boolean, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { authenticatedUsers } from './authenticatedUsers';

export const magicLinkSchema = pgTable('MagicLinks', {
  id: uuid('id').primaryKey().defaultRandom(),
  authenticatedUserId: uuid('authenticatedUserId').references(() => authenticatedUsers.authenticatedUserId).notNull(),
  email: varchar('email', { length: 255 }),
  destination: varchar('destination', { length: 255 }),
  isValid: boolean('isValid').default(true).notNull(),
  numberAvailableUses: integer('numberAvailableUses').default(1).notNull(),
  shortenId: varchar('shortenId', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});