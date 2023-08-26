import { Button, TextField } from "@kobalte/core";
import { getOrElse, isRight } from "fp-ts/lib/Either";
import { Show } from "solid-js";
import { Title } from "solid-start";
import { useI18n } from "~/env/i18n";
import { loginWithEmailForm } from "~/server/api/auth";

export default function LoginWithEmail() {
  const [t] = useI18n();

  const [submitting, { Form }] = loginWithEmailForm();

  const FormTemplate = () => (
    <Form class="flex w-1/2 flex-col gap-6 rounded-no-left-top bg-yellow-bg p-12">
      <h1 class="font-inter text-4xl font-medium text-primary-purple">
        {t.LOGIN_PAGE_HEADER()}
      </h1>
      <TextField.Root>
        <TextField.Input
          name="email"
          placeholder={t.EMAIL_ADDRESS()}
          class="w-full rounded-lg p-4 text-2xl font-medium shadow-primary-input"
        />
      </TextField.Root>
      <Button.Root
        type="submit"
        class="ml-auto rounded-full bg-primary-purple px-6 py-4 font-semibold text-white"
      >
        {t.CONTINUTE()}
      </Button.Root>
    </Form>
  );

  return (
    <>
      <Title>
        {t.APP_NAME()} - {t.LOGIN_PAGE_TITLE()}
      </Title>
      <div class="flex h-screen flex-col items-center justify-center overflow-hidden bg-yellow-red bg-cover bg-no-repeat">
        <Show
          when={submitting.result && isRight(submitting.result)}
          fallback={<FormTemplate />}
        >
          {getOrElse(() => "No magic link for ya ;(")(submitting.result!)}
        </Show>
      </div>
    </>
  );
}
