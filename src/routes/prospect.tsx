import { Outlet } from 'solid-start';
import AuthGuard from '~/components/guards';

export default function ProspectCatchAll() {
  return <AuthGuard role="isProspect">
    <Outlet />
  </AuthGuard>
}