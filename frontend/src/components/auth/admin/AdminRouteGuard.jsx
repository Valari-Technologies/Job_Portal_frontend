import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRouteGuard({ children }) {
  const adminToken = localStorage.getItem('admin_access_token') || localStorage.getItem('access_token');
  const adminUserStr = localStorage.getItem('admin_auth_user') || localStorage.getItem('auth_user');
  let adminUser = null;
  if (adminUserStr) {
    try {
      adminUser = JSON.parse(adminUserStr);
    } catch {
      adminUser = null;
    }
  }

  const token = adminToken;
  const user = adminUser;
  const role = user?.role || localStorage.getItem('admin_auth_role') || localStorage.getItem('auth_role');
  const status = user?.status || 'ACTIVE';

  if (!token || !user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN') || status !== 'ACTIVE') {
    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
