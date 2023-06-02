import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { AvatarTypeEnum } from '~/server/enums/avatar';

const avatarEnum = pgEnum('avatarEnum', Object.values(AvatarTypeEnum) as [string, ...string[]])

export const avatarSchema = pgTable('Avatars', {
  avatarId: uuid('avatarId').primaryKey(),
  type: avatarEnum('type'),
  url: varchar('url', { length: 255 }),
});