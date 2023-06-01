import { z } from "zod";
import { createServerAction$ } from 'solid-start/server';
import { generateLink } from '../services/link';

const emailSchema = z.string().email();

export const loginWithEmailForm = () => createServerAction$(async (formData: FormData) => {
  const email = formData.get('email') as string;
  const validation = emailSchema.safeParse(email);
  
  if (!validation.success) {
    return { success: false, message: "Invalid email address" };
  }
  
  generateLink(email, 'login');

  return { success: true, message: "Email sent" };
});