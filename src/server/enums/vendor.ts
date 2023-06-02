import { pgEnum } from 'drizzle-orm/pg-core';

export enum VendorAccountLevelEnum {
  TRIAL = 'trial',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DEMO = 'demo',
}

export const vendorAccountLevelEnumPg = pgEnum('vendorAccountLevelEnum', Object.values(VendorAccountLevelEnum) as [string, ...string[]]);