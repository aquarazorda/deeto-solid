import { Suspense } from 'solid-js';
import { A, Outlet } from 'solid-start';
import { HomeRounded } from '~/assets/icons/HomeRounded';
import AuthGuard from '~/components/guards';
import Spinner from '~/components/loaders/Spinner';
import { useUser } from '~/providers/userProvider';

export default function VendorMain() {
  const { user } = useUser();

  return <AuthGuard role="isVendor">
    <div class="h-screen w-screen bg-primary-purple p-4">
      {/* TODO */}
      <div class="flex h-full w-full gap-4">
        <nav class="flex w-20 flex-col gap-4">
          <img
            src={
              "https://deeto-images-dev.s3.us-east-1.amazonaws.com/deetoPhotoUploads-127dd5ea-33d2-4efb-b80a-d51780aa8942"
            }
          />
          <ul class="flex h-full flex-col gap-2 font-medium text-white">
            <li>
              <A
                href="/"
                class="flex flex-col items-center justify-center gap-1"
                activeClass="text-primary-yellow"
              >
                <HomeRounded class="h-8 w-8" />
                Dashboard
              </A>
            </li>
            {/* <li>
              <A
                href="/reference/rewards"
                class="flex flex-col items-center justify-center gap-1"
                activeClass="text-primary-yellow"
              >
                <GiftIcon class="h-8 w-8" />
                Rewards
              </A>
            </li> */}
            <img
              src={user?.avatar?.url || ""}
              class="mt-auto rounded-no-left-top"
            />
          </ul>
        </nav>
        <div class="h-full w-full overflow-auto rounded-no-left-top bg-white-900">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  </AuthGuard>
}