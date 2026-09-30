import { Navigate, Outlet } from 'react-router-dom';
import { getAuthItem } from '../../../services/auth/adminAuthService';

export default function RecruiterRouteGuard({ children }) {
  const publicToken = getAuthItem('public_access_token');
  const publicUserStr = getAuthItem('public_auth_user');
  let publicUser = null;
  if (publicUserStr) {
    try {
      publicUser = JSON.parse(publicUserStr);
    } catch {
      publicUser = null;
    }
  }

  const token = publicToken;
  const user = publicUser;
  const role = user?.role || getAuthItem('public_auth_role');

  if (!token || !user || (role !== 'HR' && role !== 'RECRUITER')) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
