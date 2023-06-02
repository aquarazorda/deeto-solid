import { query$ } from '@prpc/solid';
import authorizer from '../cognito/authorizer';
import { getByIdWithRolesAndAvatar } from '../services/authenticatedUser';

export const getMe = query$({
  key: 'getMe',
  middlewares: [authorizer],
  queryFn: async ({ ctx$ }) => {
    if (!ctx$.authenticatedUserId) {
      return undefined;
    }

    const user = await getByIdWithRolesAndAvatar(ctx$.authenticatedUserId);

    return user;
  },
})