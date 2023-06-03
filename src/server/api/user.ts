import { query$ } from "@prpc/solid";
import authorizer from "../cognito/authorizer";
import { getByIdWithRolesAndAvatar } from "../services/authenticatedUser";
import { withAuthUserId } from '../utils/response';
import { pipe } from 'fp-ts/lib/function';


export const getMe = query$({
  key: "getMe",
  middlewares: [authorizer],
  queryFn: ({ ctx$ }) => {
    return pipe(
      ctx$,
      withAuthUserId(getByIdWithRolesAndAvatar),
    )
  }
});
