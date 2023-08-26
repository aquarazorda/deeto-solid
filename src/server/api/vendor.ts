import {
  withAuth$,
} from "../cognito/authorizer";
import { getAllReferences } from "../services/accountContacts";

export const getReferenceDashboard = withAuth$(({ vendorContact }) =>
  getAllReferences({ vendorId: vendorContact.vendorId })
);

// export const getReferenceDashboard = query$({
//   key: queryKeys.getReferenceDashboard,
//   queryFn: ({ ctx$ }) => {
//     const sda = (context: AuthMiddlewareResponse$) => pipe(
//       ctx$,
//       map(({ vendorContact }) => ({ vendorId: vendorContact.vendorId})),
//       fromEither,
//       chain(getAllReferences)
//     );
//     return true;
//   },
//   middlewares: [authMiddleware],
// });
