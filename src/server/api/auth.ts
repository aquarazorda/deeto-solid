import { z } from "zod";
import { createServerAction$ } from 'solid-start/server';
import { generateLink } from '../services/link';
import { left } from 'fp-ts/lib/Either';
import { ErrorsEnum } from '../enums/errors';

const emailSchema = z.string().email();

export const loginWithEmailForm = () => createServerAction$(async (formData: FormData) => {
  const email = formData.get('email') as string;
  const validation = emailSchema.safeParse(email);
  
  if (!validation.success) {
    return left(ErrorsEnum.DEETO_USERS_ONLY);
  }

  return await generateLink(email, '/')();
});
