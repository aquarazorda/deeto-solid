import { db } from '../db';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { ErrorsEnum } from '../enums/errors';
import { and, eq } from 'drizzle-orm';
import { accountSchema } from '../db/schema/account';
import { accountContactSchema } from '../db/schema/accountContact';
import { avatarSchema } from '../db/schema/avatar';
import { authenticatedUsers } from '../db/schema/authenticatedUsers';
import { authenticatedUserPrivileges } from '../db/schema/authenticatedUserPrivileges';
import { UserPrivilegeEnum } from '../enums/userPrivileges';
import { vendorSchema } from '../db/schema/vendor';

type GetAllReferenceProps = {
  vendorId: string;
};

export const getAllReferences = ({ vendorId }: GetAllReferenceProps) => {
  const query = db.select()
    .from(accountContactSchema)
    .innerJoin(accountSchema, eq(accountContactSchema.accountId, accountSchema.accountId))
    .innerJoin(authenticatedUsers, eq(accountContactSchema.authenticatedUserId, authenticatedUsers.authenticatedUserId))
    .innerJoin(authenticatedUserPrivileges, eq(authenticatedUsers.authenticatedUserId, authenticatedUserPrivileges.authenticatedUserId))
    .innerJoin(vendorSchema, eq(accountSchema.vendorId, vendorSchema.vendorId))
    .leftJoin(avatarSchema, eq(authenticatedUsers.avatarId, avatarSchema.avatarId))
    .where(and(
      eq(accountSchema.vendorId, vendorId),
      eq(authenticatedUserPrivileges.userPrivileges, UserPrivilegeEnum.REFERENCE)
    ))

  return tryCatch(() => query, (err) => {
    console.log(err);
    return ErrorsEnum.INTERNAL_SERVER_ERROR;
  });
}