import { ErrorsEnum } from "../enums/errors";
import { cognitoGetDefaultAccount, loginPasswordLess } from "./cognito";
import { flow, pipe } from "fp-ts/lib/function";
import { serverEnv } from "~/env/server";
import { db } from "../db";
import { magicLinkSchema } from "../db/schema/magicLink";
import {
  tryCatch,
  chain,
  map,
  fromNullable,
  chainEitherK,
  tap,
  bindTo,
  bind,
} from "fp-ts/lib/TaskEither";
import { v4 as uuidv4 } from "uuid";
import type { ExtractFromTE } from "~/types/utils";
import type { InferModel} from "drizzle-orm";
import { eq } from "drizzle-orm";
import { MAGIC_LINK_EXPIRE_IN_MS } from "../utils/constants";
import { left, right } from "fp-ts/lib/Either";
import { getByIdWithRolesAndAvatar, isUserLocked } from "./authenticatedUser";
import { findByCognitoId } from "../cognito/authorizer";

const getLinkForClient = (shortenId: string) => {
  return `${serverEnv.CLIENT_ADDR}/?ml=${shortenId}`;
};

const isLinkValid = (link: InferModel<typeof magicLinkSchema, "select">) => {
  return link.numberAvailableUses >= 1 &&
    link.createdAt.getTime() + MAGIC_LINK_EXPIRE_IN_MS < Date.now()
    ? right(link.authenticatedUserId)
    : left(ErrorsEnum.INVALID_MAGIC_LINK);
};

const findMagicLink = (id: string) =>
  pipe(
    tryCatch(
      () =>
        db.query.magicLinkSchema.findFirst({
          where: eq(magicLinkSchema.id, id),
        }),
      () => ErrorsEnum.MISSING_REQUIRED_FIELD
    ),
    chain(fromNullable(ErrorsEnum.NOT_FOUND))
  );

export const useMagicLink = flow(
  findMagicLink,
  chainEitherK(isLinkValid),
  chain(getByIdWithRolesAndAvatar),
  tap(({ cognitoUserId }) => findByCognitoId(cognitoUserId)),
  bindTo("user"),
  bind('tokens', ({ user }) => loginPasswordLess(user)),
  chainEitherK(({ user, tokens }) => right({
    ...user,
    accessToken: tokens.AccessToken,
    refreshToken: tokens.RefreshToken,
  }))
);

const createMagicLink =
  (email: string, destination: string) =>
  (user: ExtractFromTE<ReturnType<typeof cognitoGetDefaultAccount>>) => {
    const query = db
      .insert(magicLinkSchema)
      .values({
        id: uuidv4(),
        email,
        destination,
        authenticatedUserId: user.authenticatedUserId,
        isValid: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        numberAvailableUses: /localhost|dev|staging/.test(serverEnv.CLIENT_ADDR)
          ? 100
          : 1,
      })
      .returning({ id: magicLinkSchema.id });

    return tryCatch(
      () => query,
      () => ErrorsEnum.MISSING_REQUIRED_FIELD
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
