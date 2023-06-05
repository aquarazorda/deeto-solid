import { serverEnv } from "~/env/server";
import { cognitoClient } from "../cognito/aws.sdk.config";
import { db } from "../db";
import { userAccounts } from "../db/schema/users";
import { and, eq, or } from "drizzle-orm";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import { UserStatusEnum } from "../enums/userStatus";
import type { AdminGetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import {
  tryCatch,
  chain,
  fromNullable as fromNullableTE,
  chainEitherK,
} from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import type { ExtractFromTE } from "~/types/utils";
import { fromNullable } from "fp-ts/lib/Either";
import { ErrorsEnum } from "../enums/errors";

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
