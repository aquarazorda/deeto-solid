import { Outlet } from 'solid-start';
import AuthGuard from '~/components/guards';

export default function ReferenceMain() {

  return <AuthGuard role="isReference">
    <Outlet />
  </AuthGuard>
}