import { Outlet } from 'solid-start';
import AuthGuard from '~/components/guards';

export default function VendorMain() {

  return <AuthGuard role="isVendor">
    <Outlet />
  </AuthGuard>
}