import { ErrorsEnum } from "../enums/errors";
import { cognitoGetDefaultAccount } from "./cognito";
import { pipe } from "fp-ts/lib/function";
import { serverEnv } from "~/env/server";
import { db } from "../db";
import { magicLinkSchema } from "../db/schema/magicLink";
import { tryCatch, chain, fromNullable, map } from "fp-ts/lib/TaskEither";
import type { ExtractFromTE } from "~/types/utils";

const getLinkForClient = (shortenId: string) => {
  return `${serverEnv.CLIENT_ADDR}?ml=${shortenId}`;
};

const createMagicLink =
  (email: string, destination: string) =>
  (user: ExtractFromTE<ReturnType<typeof cognitoGetDefaultAccount>>) => {
    const query = db
      .insert(magicLinkSchema)
      .values({
        email,
        destination,
        authenticatedUserId: user.authenticatedUserId,
        isValid: true,
        numberAvailableUses: /localhost|dev|staging/.test(serverEnv.CLIENT_ADDR)
          ? 100
          : 1,
      })
      .returning({ id: magicLinkSchema.id });

    return tryCatch(
      () => query,
      (e) => {
        console.log(e);
        return ErrorsEnum.MISSING_REQUIRED_FIELD;
      }
    );
  };

export const generateLink = (
  email: string,
  destination: string,
  authenticatedUserId?: string
) => {
  // TODO add logic for email sending
  return pipe(
    cognitoGetDefaultAccount(email),
    chain(createMagicLink(email, destination)),
    map((s) => getLinkForClient(s[0].id))
  );
};
