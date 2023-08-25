import { query$ } from '@prpc/solid';
import queryKeys from '../queryKeys';
import { authMiddleware } from '../cognito/authorizer';
import { searchReferencesRequestSchema } from '../utils/validationSchemas/searchReferences';

export const getReferenceDashboard = query$({
  key: queryKeys.getReferenceDashboard,
  queryFn: ({ ctx$, payload }) => {
    const validateResult = searchReferencesRequestSchema.safeParse(payload);
    console.log(ctx$);
    
    return true;
  },
  middlewares: [authMiddleware],
});