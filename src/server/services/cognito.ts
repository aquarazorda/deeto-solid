import { serverEnv } from "~/env/server";
import { cognitoClient } from "../cognito/aws.sdk.config";
import { db } from "../db";
import { userAccounts } from "../db/schema/users";
import type { InferModel } from "drizzle-orm";
import { and, eq, or } from "drizzle-orm";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import { UserStatusEnum } from "../enums/userStatus";
import type { AdminGetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import {
  AdminGetUserCommand,
  AdminRespondToAuthChallengeCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  tryCatch,
  chain,
  fromNullable as fromNullableTE,
  chainEitherK,
} from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import type { ExtractFromTE } from "~/types/utils";
import { fromNullable, left, right } from "fp-ts/lib/Either";
import { ErrorsEnum } from "../enums/errors";
import { REFRESH_TOKEN_SEPARATOR } from "../utils/constants";

type CustomAuthParams = {
  AuthFlow: string;
  AuthParameters: {
    USERNAME?: string;
    REFRESH_TOKEN?: string;
  };
};

const cognitoAdminGetUser = (username: string) => {
  const command = new AdminGetUserCommand({
    UserPoolId: serverEnv.USER_POOL_ID,
    Username: username,
  });

  return tryCatch(
    () => cognitoClient.send(command),
    () => ErrorsEnum.COGNITO_USER_NOT_FOUND
  );
};

export const initiateCustomAuth = (params: CustomAuthParams) => {
  const command = new InitiateAuthCommand({
    ...params,
    ClientId: serverEnv.CLIENT_ID,
  });

  return tryCatch(
    () => cognitoClient.send(command),
    () => ErrorsEnum.UNAUTHORIZED
  );
};

const respondToAuthChallenge = (
  username: string,
  session?: string,
  metadata?: Record<string, string>
) => {
  const command = new AdminRespondToAuthChallengeCommand({
    ChallengeName: "CUSTOM_CHALLENGE",
    ClientId: serverEnv.CLIENT_ID,
    UserPoolId: serverEnv.USER_POOL_ID,
    ChallengeResponses: {
      USERNAME: username,
      ANSWER: "_",
    },
    ClientMetadata: metadata,
    Session: session,
  });

  return tryCatch(
    () => cognitoClient.send(command),
    () => ErrorsEnum.INVALID_MAGIC_LINK
  );
};

const queryWithCognitoId = (data: AdminGetUserCommandOutput) =>
  pipe(
    fromNullableTE(ErrorsEnum.COGNITO_USER_NOT_FOUND)(data.Username),
    chain((username: string) =>
      tryCatch(
        () =>
          db.query.userAccounts.findMany({
            where: eq(userAccounts.cognitoId, username),
          }),
        () => ErrorsEnum.COGNITO_USER_DOES_NOT_MATCH
      )
    )
  );

export const loginPasswordLess = (user: {
  cognitoUserId: string;
  authenticatedUserId: string;
}) => {
  return pipe(
    initiateCustomAuth({
      AuthFlow: "CUSTOM_AUTH",
      AuthParameters: {
        USERNAME: user.cognitoUserId,
      },
    }),
    chain((data) =>
      respondToAuthChallenge(user.cognitoUserId, data.Session, {
        // vendor_id: user.vendorId,
        authenticated_user_id: user.authenticatedUserId,
        cognito_id: user.cognitoUserId,
      })
    ),
    chainEitherK((res) => {
      if (
        !res.AuthenticationResult ||
        !res.AuthenticationResult?.AccessToken ||
        !res.AuthenticationResult?.RefreshToken
      ) {
        return left(ErrorsEnum.INVALID_MAGIC_LINK);
      }

      const refreshToken = res.AuthenticationResult.RefreshToken;

      return right({
        AccessToken: res.AuthenticationResult.AccessToken,
        RefreshToken: `${refreshToken}${REFRESH_TOKEN_SEPARATOR}${user.authenticatedUserId}`,
      });
    })
  );
};

const queryAuthenticatedUsers = (
  accounts: ExtractFromTE<ReturnType<typeof queryWithCognitoId>>
) =>
  tryCatch(
    () =>
      db.query.authenticatedUsers.findFirst({
        where: and(
          or(
            eq(authenticatedUsers.userStatus, UserStatusEnum.CONFIRMED),
            eq(authenticatedUsers.userStatus, UserStatusEnum.PENDING)
          ),
          or(
            ...accounts.map(({ authenticatedUserId }) =>
              eq(authenticatedUsers.authenticatedUserId, authenticatedUserId)
            )
          )
        ),
      }),
    () => ErrorsEnum.AUTHENTICATED_USER_NOT_FOUND
  );

export const cognitoGetDefaultAccount = flow(
  cognitoAdminGetUser,
  chain(queryWithCognitoId),
  chain(queryAuthenticatedUsers),
  chainEitherK(fromNullable(ErrorsEnum.AUTHENTICATED_USER_NOT_FOUND))
);
