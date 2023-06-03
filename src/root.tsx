// @refresh reload
import "./root.css";
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  Link,
} from "solid-start";
import { QueryProvider } from "@prpc/solid";
import { QueryClient } from "@tanstack/solid-query";
import { I18nProvider } from "./env/i18n";
import UserProvider from "./providers/userProvider";

const queryClient = new QueryClient();

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Deeto</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#026d56" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap&subset=latin-ext"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap&subset=latin-ext"
          rel="stylesheet"
        />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <Body class="font-sans">
        <I18nProvider>
          <QueryProvider queryClient={queryClient}>
            <Suspense>
              <ErrorBoundary>
                <UserProvider>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </UserProvider>
              </ErrorBoundary>
            </Suspense>
          </QueryProvider>
        </I18nProvider>
        <Scripts />
      </Body>
    </Html>
  );
}
