import { middleware$ } from "@prpc/solid";
import { parse } from "cookie";
import { serverEnv } from "~/env/server";
import { db } from "../db";
import { userAccounts } from "../db/schema/users";
import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { UserStatusEnum } from "../enums/userStatus";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import type { Either} from 'fp-ts/lib/Either';
import { left, right } from 'fp-ts/lib/Either';

type TokenPayload = {
  sub: string;
  authenticatedUserId: string;
  vendorId: string;
  databasePath: "/";
  cognitoId: string;
};

export type AuthorizerResponse = Either<string,{
  authenticatedUserId: string,
  vendorId: string,
  cognitoId: string,  
}>;

const loadJWK = async (region: string, poolId: string) => {
  const addr = `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`;
  const response = await fetch(addr, { method: "GET" });
  
  return (await response.json()) as { keys: jwkToPem.JWK[] };
};

const authorizer = middleware$(async ({ request$ }): Promise<AuthorizerResponse> => {
  const cookies = parse(request$.headers.get("cookie") || "");
  const token = cookies.accessToken;

  if (!token) {
    return left("No token");
  }

  let tokenPayload = {} as TokenPayload;
  let err;

  if (
    (serverEnv.CLIENT_ADDR.includes("dev") ||
      serverEnv.CLIENT_ADDR.includes("staging")) &&
    token.includes("deeto-dev")
  ) {
    const tryingToAuthenticateWith = token.split("deeto-dev-")[1];

    const userAccount = await db.query.userAccounts.findFirst({
      where: eq(userAccounts.userAccountId, tryingToAuthenticateWith),
    });

    if (!userAccount) {
      return left("No user account");
    }

    tokenPayload = {
      sub: "deeto-vendor",
      authenticatedUserId: userAccount.authenticatedUserId,
      vendorId: userAccount.vendorId,
      databasePath: "/",
      cognitoId: userAccount.cognitoId,
    };
  } else {
    try {
      const jwk = await loadJWK(serverEnv.REGION, serverEnv.USER_POOL_ID);
      const pem = jwkToPem(jwk.keys[0]);

      tokenPayload = jwt.verify(token, pem, {
        algorithms: ["RS256"],
      }) as TokenPayload;
    } catch (error) {
      console.log(error);
      err = error;
    }
  }

  if (err) {
    return left("Invalid token");
  }

  const user = await db.query.authenticatedUsers.findFirst({
    where: and(
      eq(
        authenticatedUsers.authenticatedUserId,
        tokenPayload?.authenticatedUserId
      ),
      eq(authenticatedUsers.cognitoUserId, tokenPayload.sub)
    ),
  });
  // TODO
  // include: [{ model: AccountContact, include: [{ model: Account }] }, { model: VendorContact }],

  if (!user || user.userStatus === UserStatusEnum.LOCKED) {
    return left("User not found or locked");
  }

  const requestContext = {
    authenticatedUserId: tokenPayload.authenticatedUserId,
    vendorId: tokenPayload.vendorId,
    cognitoId: tokenPayload.cognitoId,
  };

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

  return right(requestContext);
});

export default authorizer;
