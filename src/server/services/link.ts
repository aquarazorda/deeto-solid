import { ErrorsEnum } from '../enums/errors';
import { cognitoGetDefaultAccount } from './cognito';

export const generateLink = async (
  email: string,
  destination: string,
  authenticatedUserId?: string
) => {
  const userAccount = await cognitoGetDefaultAccount(email);
  if (!userAccount) {
    // no account returned from routing service, the account must be locked or deleted
    throw new Error(ErrorsEnum.USER_LOCKED);
  }

  return userAccount;
};
