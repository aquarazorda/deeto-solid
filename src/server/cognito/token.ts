import { tryCatch, map, chain, chainEitherK } from "fp-ts/lib/TaskEither";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import type { Right} from "fp-ts/lib/Either";
import { left, right } from "fp-ts/lib/Either";
import { serverEnv } from "~/env/server";
import { pipe } from "fp-ts/lib/function";
import { ErrorsEnum } from '../enums/errors';
import { queryUserAccount } from './authorizer';

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

  return tryCatch(() => res, () => ErrorsEnum.INTERNAL_SERVER_ERROR);
};

const loadJWT = (token: string, pem: string) =>
  tryCatch(async () => {
    const payload = (await jwt.verify(token, pem, {
      algorithms: ["RS256"],
    })) as Promise<TokenPayload>;

    return payload;
  }, () => ErrorsEnum.UNAUTHORIZED);

export const decodeToken = (tokenR: Right<string>) => {
  const token = tokenR.right;
  
  if (
    /localhost|dev|staging/.test(serverEnv.CLIENT_ADDR) &&
    token.startsWith("deeto-dev-")
  ) {
    const tryingToAuthenticateWith = token.split("deeto-dev-")[1];

    return pipe(
      queryUserAccount(tryingToAuthenticateWith),
      chainEitherK((userAccount) =>
        userAccount
          ? right({
              sub: "deeto-vendor",
              authenticatedUserId: userAccount.authenticatedUserId,
              vendorId: userAccount.vendorId,
              databasePath: "/",
              cognitoId: userAccount.cognitoId,
            })
          : left(ErrorsEnum.USER_DONT_EXITS)
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
