import { middleware$ } from "@prpc/solid";
import { parse } from "cookie";
import { UserStatusEnum } from "../enums/userStatus";
import type { Either } from "fp-ts/lib/Either";
import { left, right, fromNullable } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import {
  chain,
  fromEither,
  chainEitherK,
} from "fp-ts/lib/TaskEither";
import { decodeToken } from './token';
import { getUserWithCognito } from '../services/authenticatedUser';

export type AuthorizerResponse = Either<
  string,
  {
    authenticatedUserId: string;
    vendorId: string;
    cognitoId: string;
  }
>;

const authorizer = middleware$(
  async ({ request$ }): Promise<AuthorizerResponse> => {
    const cookies = parse(request$.headers.get("cookie") || "");
    const token = cookies.accessToken;

    return pipe(
      fromNullable("Token not found")(token),
      fromEither,
      chain(decodeToken),
      chain(getUserWithCognito),
      chainEitherK(({ user, tokenPayload }) =>
        !user || user.userStatus === UserStatusEnum.LOCKED
          ? left("User not found or locked")
          : right(tokenPayload)
      )
    )();

    // TODO
    // if (user?.vendorContact?.vendorContactId) {
    //   requestContext.vendorContactId = user?.vendorContact?.vendorContactId;
    // }

    // Authorizer response context values must be of type string, number, or boolean
    // const accountContactIds = user?.accountContacts?.map(
    //   (el) => el.accountContactId
    // );
    // if (accountContactIds?.length) {
    //   requestContext.accountContactIds = JSON.stringify(accountContactIds);
    // }
  }
);

export default authorizer;
