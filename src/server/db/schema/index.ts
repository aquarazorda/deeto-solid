import * as usersSchema from './users';
import * as authenticatedUsersSchema from './authenticatedUsers';

export default {
  ...usersSchema,
  ...authenticatedUsersSchema,
}