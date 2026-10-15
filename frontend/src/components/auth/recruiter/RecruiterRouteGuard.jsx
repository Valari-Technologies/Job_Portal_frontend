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
    // If Super Admin is logged in, redirect to Super Admin portal
    const saToken = getAuthItem('super_admin_access_token');
    const saRole = getAuthItem('super_admin_auth_role');
    if (saToken && saRole === 'SUPER_ADMIN') {
      return <Navigate to="/super-admin/overview" replace />;
    }

    // If Admin is logged in, redirect to Admin portal
    const adminToken = getAuthItem('admin_access_token');
    const adminRole = getAuthItem('admin_auth_role');
    if (adminToken && adminRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // If Candidate is logged in, redirect to Candidate portal
    const candToken = getAuthItem('candidate_access_token');
    const candRole = getAuthItem('candidate_auth_role');
    if (candToken && candRole === 'CANDIDATE') {
      return <Navigate to="/candidate/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
