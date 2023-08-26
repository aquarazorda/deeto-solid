import { query$ } from '@prpc/solid';
import queryKeys from '../queryKeys';
import { authMiddleware } from '../cognito/authorizer';
import { getAllReferences } from '../services/accountContacts';
import { map } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { fromEither, chain } from 'fp-ts/lib/TaskEither';

export const getReferenceDashboard = query$({
  key: queryKeys.getReferenceDashboard,
  queryFn: ({ ctx$ }) => {
    return pipe(
      ctx$,
      map(({ vendorContact }) => ({ vendorId: vendorContact.vendorId})),
      fromEither,
      chain(getAllReferences)
    )();
  },
  middlewares: [authMiddleware],
});