import { left } from "fp-ts/lib/Either";
import { For, Suspense, createResource } from "solid-js";
import { Title, useRouteData } from "solid-start";
import Avatar from "~/components/avatar";
import { ShowEither } from "~/components/fp-ts/ShowEither";
import Spinner from "~/components/loaders/Spinner";
import { useI18n } from "~/env/i18n";
import { getReferenceDashboard } from "~/server/api/vendor";
import { ErrorsEnum } from "~/server/enums/errors";

export const routeData = () => {
  const [data] = createResource(getReferenceDashboard, {
    initialValue: left(ErrorsEnum.INTERNAL_SERVER_ERROR),
  });
  return data;
};

export default function VendorDashboard() {
  const [t] = useI18n();
  const data = useRouteData<typeof routeData>();

  return (
    <>
      <Title>
        {t.APP_NAME()} - {t.REFERENCES()}
      </Title>
      <div class="flex flex-col gap-6 p-6">
        <h1 class="font-inter text-5xl font-bold text-primary-purple">
          {t.REFERENCES()}
        </h1>
        <Suspense fallback={<Spinner />}>
          <div class="flex flex-wrap gap-2">
            <ShowEither either={data()}>
              {(data) => (
                <For each={data}>
                  {(item) => (
                    <div class="flex min-w-[16rem] flex-1 flex-col rounded-2xl rounded-tl-none bg-white">
                      <div class="flex flex-col gap-4 p-4 shadow-ref-box">
                        <div>
                          <div class="flex gap-4">
                            <Avatar
                              firstName={item.AuthenticatedUsers.firstName}
                              lastName={item.AuthenticatedUsers.lastName}
                            />
                            <div class="flex flex-col justify-center font-inter font-semibold text-purple-dark">
                              <span>
                                {item.AuthenticatedUsers.firstName}{" "}
                                {item.AuthenticatedUsers.lastName}
                              </span>
                              <span>TODO at {item.Vendors.name}</span>
                            </div>
                          </div>
                          <div
                            style={{
                              "overflow-wrap": "break-word",
                              display: "flex",
                              "flex-wrap": "wrap",
                              gap: "8px",
                            }}
                          >
                            <div class="sc-cyRfQX PcJpI">Hospitality</div>
                          </div>
                        </div>
                        <div class="sc-gueYoa sc-ktEKTO sc-UxxwN cTCzBI jBPOvU djJyug">
                          <div
                            style={{
                              "overflow-wrap": "break-word",
                              display: "flex",
                              "align-items": "flex-start",
                              "justify-content": "flex-start",
                              "flex-wrap": "wrap",
                              gap: "8px",
                            }}
                          >
                            <span
                              color="orangeTints100"
                              class="sc-irTswW gLCDdB"
                            >
                              Quote
                            </span>
                            <span
                              color="orangeTints100"
                              class="sc-irTswW gLCDdB"
                            >
                              Review
                            </span>
                            <span
                              color="orangeTints100"
                              class="sc-irTswW gLCDdB"
                            >
                              Q&amp;A
                            </span>
                            <span
                              color="orangeTints100"
                              class="sc-irTswW gLCDdB"
                            >
                              Webinars
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="rounded-b-2xl bg-secondary-green py-[0.125rem] text-center text-white shadow-ref-box">
                        <div class="font-inter text-sm font-medium uppercase">
                          {item.AuthenticatedUsers.userStatus}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              )}
            </ShowEither>
          </div>
        </Suspense>
      </div>
    </>
  );
}
