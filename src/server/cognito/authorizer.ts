import { middleware$ } from "@prpc/solid";
import { parse } from "cookie";
import { UserStatusEnum } from "../enums/userStatus";
import type { Either } from "fp-ts/lib/Either";
import { left, right } from "fp-ts/lib/Either";
import { fromOption } from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import { chain, chainEitherK } from "fp-ts/lib/TaskEither";
import type { TokenPayload} from "./token";
import { decodeToken } from "./token";
import { getUserWithCognito } from "../services/authenticatedUser";
import { lookup } from "fp-ts/lib/Record";

export type AuthorizerResponse = Either<string, TokenPayload>;

export const authorizer$ = flow(
  decodeToken,
  chain(getUserWithCognito),
  chainEitherK(({ user, tokenPayload }) =>
    !user || user.userStatus === UserStatusEnum.LOCKED
      ? left("User not found or locked")
      : right(tokenPayload)
  )
);

export const getAccessToken = (cookie: string | null) =>
  pipe(
    parse(cookie || ""),
    lookup("accessToken"),
    fromOption(() => "Token not found")
  );

const authorizer = middleware$(
  async ({ request$ }): Promise<AuthorizerResponse> => {
    return pipe(
      getAccessToken(request$.headers.get("cookie")),
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
