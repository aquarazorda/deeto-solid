import { useRouteData } from 'solid-start';
import { getReferenceDashboard } from '~/server/api/vendor';

export const routeData = () => {
  const dashboard = getReferenceDashboard();
  return { dashboard };
}

export default function VendorDashboard() {
  const data = useRouteData<typeof routeData>();

  return <div>This is vendor dashboard {String(data?.dashboard?.data)}</div>
}