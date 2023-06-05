import { Title } from "solid-start";

import { useUser } from "~/providers/userProvider";
import { useI18n } from "~/env/i18n";
import ProspectMenu from '~/components/dashboard/prospect/menu/ProspectMenu';

export default function ProspectDashboard() {
  let anchorRef: HTMLDivElement | undefined;
  const [t] = useI18n();
  const { user } = useUser();

  return (
    <>
      <Title>{t.APP_NAME()} - Prospect</Title>
      <div class="relative flex h-screen gap-6 bg-yellow-red bg-cover bg-no-repeat p-12">
        <ProspectMenu anchorRef={() => anchorRef} />
        <main
          ref={anchorRef}
          class="relative h-full w-full rounded-no-left-top bg-yellow-bg shadow-lg"
        >
          I am a {user?.firstName}
        </main>
      </div>
    </>
  );
}
