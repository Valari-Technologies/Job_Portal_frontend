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
    // If Super Admin is logged in, redirect to Super Admin overview
    const saToken = getAuthItem('super_admin_access_token');
    const saRole = getAuthItem('super_admin_auth_role');
    if (saToken && saRole === 'SUPER_ADMIN') {
      return <Navigate to="/super-admin/overview" replace />;
    }

    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
