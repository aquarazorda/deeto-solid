import {
  tryCatch,
  map,
  chain,
  chainEitherK,
} from "fp-ts/lib/TaskEither";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { left, right } from 'fp-ts/lib/Either';
import { serverEnv } from '~/env/server';
import { db } from '../db';
import { pipe } from 'fp-ts/lib/function';
import { userAccounts } from '../db/schema/users';
import { eq } from 'drizzle-orm';

export type TokenPayload = {
  sub: string;
  authenticatedUserId: string;
  vendorId: string;
  databasePath: string;
  cognitoId: string;
};

const loadJWK = (region: string, poolId: string) => {
  const addr = `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`;
  const res = fetch(addr, { method: "GET" }).then(
    (res) => res.json() as Promise<{ keys: jwkToPem.JWK[] }>
  );

  return tryCatch(() => res, String);
};

const loadJWT = (token: string, pem: string) => tryCatch(
  async () => {
    const payload = await jwt.verify(token, pem, {
      algorithms: ["RS256"],
    }) as Promise<TokenPayload>;

    return payload;
  },
  String
);

export const decodeToken = (token: string) => {
  if (
    (serverEnv.CLIENT_ADDR.includes("dev") ||
      serverEnv.CLIENT_ADDR.includes("staging")) &&
    token.includes("deeto-dev")
  ) {
    const tryingToAuthenticateWith = token.split("deeto-dev-")[1];

    return pipe(
      tryCatch(
        () =>
          db.query.userAccounts.findFirst({
            where: eq(userAccounts.userAccountId, tryingToAuthenticateWith),
          }),
        () => "DB Error"
      ),
      chainEitherK((userAccount) =>
        userAccount
          ? right({
              sub: "deeto-vendor",
              authenticatedUserId: userAccount.authenticatedUserId,
              vendorId: userAccount.vendorId,
              databasePath: "/",
              cognitoId: userAccount.cognitoId,
            })
          : left("No user account")
      )
    );
  } else {
    return pipe(
      loadJWK(serverEnv.REGION, serverEnv.USER_POOL_ID),
      map((jwk) => jwkToPem(jwk.keys[0])),
      chain((pem) => loadJWT(token, pem))
    );
  }
};