import * as usersSchema from './users';
import * as authenticatedUsersSchema from './authenticatedUsers';
import * as authenticatedUserPrivilegesSchema from './authenticatedUserPrivileges';
import * as avatarSchema from './avatar';
import * as accountContactSchema from './accountContact';
import * as accountSchema from './account';
import * as vendorSchema from './vendor';
import * as magicLinkSchema from './magicLink';

export default {
  ...usersSchema,
  ...authenticatedUsersSchema,
  ...authenticatedUserPrivilegesSchema,
  ...avatarSchema,
  ...accountContactSchema,
  ...accountSchema,
  ...vendorSchema,
  ...magicLinkSchema
}