import { type VoidComponent } from "solid-js";
import { A, Title } from "solid-start";
import ProspectMenu from "~/components/dashboard/prospect/menu/ProspectMenu";
import { useI18n } from '~/env/i18n';
import { getMe } from '~/server/api/user';

const Home: VoidComponent = () => {
  let anchorRef: HTMLDivElement | undefined;
  const [t] = useI18n();

  return (
    <>
      <Title>{t.APP_NAME()}</Title>
      <div class="relative flex h-screen gap-6 bg-yellow-red bg-cover bg-no-repeat p-12">
        <ProspectMenu anchorRef={() => anchorRef} />
        <main ref={anchorRef} class="relative h-full w-full rounded-no-left-top bg-yellow-bg shadow-lg">I am a Prospect</main>
      </div>
    </>
  );
};

export default Home;
