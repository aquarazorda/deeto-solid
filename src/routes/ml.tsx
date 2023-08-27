import { FullPageSpinner } from '~/components/loaders/Spinner';
import { onMount } from 'solid-js';
import { createServerMultiAction$ } from 'solid-start/server';
import { useSearchParams } from 'solid-start';
import { useMagicLink } from '~/server/services/link';
import { isRight } from 'fp-ts/lib/Either';

export default function MagicLinkPage() {
  const [search] = useSearchParams();
  const [, act] = createServerMultiAction$(async (id?: string) => {
    const response = new Response(null, { status: 302, headers: { Location: '/'} });

    if (id) {
      const res = await useMagicLink(id)();
  
      if (isRight(res)) {
        response.headers.append("Set-Cookie", `accessToken=${res.right.accessToken}; Path=/;`);
        response.headers.append("Set-Cookie", `refreshToken=${res.right.refreshToken}; Path=/;`);
      }
    }
  
    return response;
  });

  onMount(() => act(search.id));

  return <FullPageSpinner />;
}