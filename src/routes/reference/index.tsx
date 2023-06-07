import { Suspense } from "solid-js";
import { A, Outlet } from "solid-start";
import { GiftIcon } from "~/assets/icons/GiftIcon";
import { HomeRounded } from "~/assets/icons/HomeRounded";
import Spinner from '~/components/loaders/Spinner';
import { useUser } from "~/providers/userProvider";

export default function ReferenceDashboard() {
  const { user } = useUser();

  return (
    <div class="h-screen w-screen bg-primary-purple p-4">
      {/* TODO */}
      <div class="flex h-full w-full gap-4">
        <nav class="flex w-20 flex-col gap-4">
          <img
            src={
              "https://deeto-images-dev.s3.us-east-1.amazonaws.com/deetoPhotoUploads-127dd5ea-33d2-4efb-b80a-d51780aa8942"
            }
          />
          <ul class="flex flex-col gap-2 font-medium text-white">
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
        <div class="h-full w-full rounded-no-left-top bg-white">
          <Suspense fallback={<Spinner />}>
            <Outlet />
            <div class="flex h-full w-full items-center justify-center">
              I am {user?.firstName} {user?.lastName} and I am a Reference :)
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
