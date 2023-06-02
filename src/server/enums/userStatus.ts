import { pgEnum } from 'drizzle-orm/pg-core';

export enum UserStatusEnum {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  LOCKED = 'locked',
}

export const userStatusEnumPg = pgEnum('userStatusEnum', Object.values(UserStatusEnum) as [string, ...string[]]);