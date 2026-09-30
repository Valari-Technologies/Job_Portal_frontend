import { Navigate } from 'react-router-dom';
import { getAuthItem } from '../../../services/auth/adminAuthService';

export default function SuperAdminRouteGuard({ children }) {
  const superAdminToken = getAuthItem('super_admin_access_token') || getAuthItem('admin_access_token');
  const superAdminUserStr = getAuthItem('super_admin_auth_user') || getAuthItem('admin_auth_user');
  let superAdminUser = null;
  if (superAdminUserStr) {
    try {
      superAdminUser = JSON.parse(superAdminUserStr);
    } catch {
      superAdminUser = null;
    }
  }

  const token = superAdminToken;
  const user = superAdminUser;
  const role = user?.role || getAuthItem('super_admin_auth_role');

  if (!token || !user || role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
