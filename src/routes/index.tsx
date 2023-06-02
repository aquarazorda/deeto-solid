import { type VoidComponent } from "solid-js";
import { A, Title } from "solid-start";
import ProspectMenu from "~/components/dashboard/ProspectMenu";
import { useI18n } from '~/env/i18n';
import { getMe } from '~/server/api/user';

const Home: VoidComponent = () => {
  const [t] = useI18n();

  return (
    <>
      <Title>{t.APP_NAME()}</Title>
      <div class="flex bg-yellow-red bg-cover bg-no-repeat h-screen p-12 gap-6 relative">
        <ProspectMenu />
        <main class="w-full h-full shadow-lg bg-yellow-bg rounded-no-left-top">I am a Prospect</main>
      </div>
    </>
  );
};

export default Home;
