import { type VoidComponent } from "solid-js";
import { Title, useRouteData } from "solid-start";
import ProspectMenu from "~/components/dashboard/prospect/menu/ProspectMenu";
import { useI18n } from '~/env/i18n';
import { getMe } from '~/server/api/user';

export const routeData = () => {
  const user = getMe(undefined, () => ({
    retry: false,
    staleTime: 5 * 60 * 1000, 
  }));

  return { user }
}

const Home: VoidComponent = () => {
  let anchorRef: HTMLDivElement | undefined;
  const [t] = useI18n();
  const { user } = useRouteData<typeof routeData>();

  return (
    <>
      <Title>{t.APP_NAME()}</Title>
      <div class="relative flex h-screen gap-6 bg-yellow-red bg-cover bg-no-repeat p-12">
        <ProspectMenu anchorRef={() => anchorRef} />
        <main ref={anchorRef} class="relative h-full w-full rounded-no-left-top bg-yellow-bg shadow-lg">I am a {user.data?.firstName}</main>
      </div>
    </>
  );
};

export default Home;
