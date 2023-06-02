import type {
  AdminGetUserRequest,
  AdminGetUserResponse,
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import { serverEnv } from "~/env/server";
import { cognitoIdentityServiceProvider } from "../cognito/aws.sdk.config";
import { db } from "../db";
import { userAccounts } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { authenticatedUsers } from "../db/schema/authenticatedUsers";
import { UserStatusEnum } from "../enums/userStatus";

export const cognitoGetDefaultAccount = async (email: string) => {
  const cognitoUser = await cognitoAdminGetUser(email);
  const cognitoId = cognitoUser.Username;

  const accounts = await db.query.userAccounts.findMany({
    where: eq(userAccounts.cognitoId, cognitoId),
  });

  const unblockedAccounts = await Promise.all(
    accounts.filter(async (account) => {
      const currentUser = await db.query.authenticatedUsers.findFirst({
        where: eq(
          authenticatedUsers.authenticatedUserId,
          account.authenticatedUserId
        ),
      });

      if (
        currentUser &&
        (currentUser.userStatus === UserStatusEnum.CONFIRMED ||
          currentUser.userStatus === UserStatusEnum.PENDING)
      ) {
        return true;
      }
      return false;
    })
  );
  return unblockedAccounts.find((acc) => !!acc);
};

const cognitoAdminGetUser = (
  username: string
): Promise<AdminGetUserResponse> => {
  const adminGetUserParams: AdminGetUserRequest = {
    UserPoolId: serverEnv.USER_POOL_ID,
    Username: username,
  };

  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminGetUser(
      adminGetUserParams,
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};
