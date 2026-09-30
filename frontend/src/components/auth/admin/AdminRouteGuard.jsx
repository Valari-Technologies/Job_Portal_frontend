import { Navigate, Outlet } from 'react-router-dom';
import { getAuthItem } from '../../../services/auth/adminAuthService';

export default function AdminRouteGuard({ children }) {
  const adminToken = getAuthItem('admin_access_token');
  const adminUserStr = getAuthItem('admin_auth_user');
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
  const role = user?.role || getAuthItem('admin_auth_role');
  const status = user?.status || 'ACTIVE';

  if (!token || !user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN') || status !== 'ACTIVE') {
    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
