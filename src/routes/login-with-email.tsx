import { Button, TextField } from '@kobalte/core';
import { Title } from "solid-start";
import { useI18n } from '~/root';
import { loginWithEmailForm } from '~/server/api/auth';

export default function LoginWithEmail() {
  const [t] = useI18n();

  const [submitting, { Form }] = loginWithEmailForm();

  return (
    <>
      <Title>
        {t.APP_NAME()} - {t.LOGIN_PAGE_TITLE()}
      </Title>
      <div class="flex flex-col overflow-hidden bg-yellow-red h-screen items-center justify-center bg-cover bg-no-repeat">
        <Form class="flex flex-col rounded-no-left-top bg-yellow-bg p-12 gap-6 w-1/2">
          <h1 class="font-inter font-medium text-4xl text-primary-purple">
            {t.LOGIN_PAGE_HEADER()}
          </h1>
          <TextField.Root>
            <TextField.Input name='email' placeholder={t.EMAIL_ADDRESS()} class="w-full shadow-primary-input p-4 rounded-lg text-2xl font-medium"/>
          </TextField.Root>
          <Button.Root type='submit' class="ml-auto rounded-full py-4 px-6 bg-primary-purple font-semibold text-white">
            {t.CONTINUTE()}
          </Button.Root>
        </Form>
      </div>
    </>
  );
}
