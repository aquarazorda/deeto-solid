import { query$ } from '@prpc/solid';
import authorizer from '../cognito/authorizer';

export const getMe = query$({
  key: 'getMe',
  middlewares: [authorizer],
  queryFn: async ({ ctx$ }) => {
    console.log(ctx$);
    return true;
  },
})